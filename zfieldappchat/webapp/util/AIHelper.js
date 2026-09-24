sap.ui.define([
	"customer/porky/zfieldappchat/util/AIConfig"
], function (AIConfig) {
	"use strict";

	// -------------------------------------------------------------------
	// Calling OpenRouter directly from the browser. This means the API key
	// is shipped to every client - anyone opening dev tools / viewing source
	// can read it. Keep it on a restricted/low-limit OpenRouter account, and
	// rotate it if it ever leaks (same as the git-filter-repo cleanup you
	// already had to do once). The key itself lives in AIConfig.js, which is
	// gitignored - see AIConfig-sample.js for the template. This still ships
	// the key to the browser at runtime; it only stops it from being
	// committed. A real fix moves this whole call behind a server-side proxy
	// that holds the key instead.
	// -------------------------------------------------------------------
	var OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
	var MODEL = "anthropic/claude-haiku-4.5"; // fast/cheap is plenty for these tasks

	function callOpenRouter(sSystemPrompt, sUserPrompt) {
		return new Promise(function (resolve, reject) {
			var sApiKey = AIConfig && AIConfig.OPENROUTER_API_KEY;
			if (!sApiKey || sApiKey.indexOf("REPLACE-ME") !== -1) {
				reject(new Error("No OpenRouter API key configured - copy webapp/util/AIConfig-sample.js " +
					"to webapp/util/AIConfig.js and fill in a real key from https://openrouter.ai/keys"));
				return;
			}
			jQuery.ajax({
				url: OPENROUTER_URL,
				method: "POST",
				contentType: "application/json",
				headers: {
					"Authorization": "Bearer " + sApiKey,
					// optional but recommended by OpenRouter for attribution/rate-limit tracking
					"HTTP-Referer": window.location.origin,
					"X-Title": "Porky Field Rep Visit Chat"
				},
				data: JSON.stringify({
					model: MODEL,
					temperature: 0,
					messages: [
						{ role: "system", content: sSystemPrompt },
						{ role: "user", content: sUserPrompt }
					]
				}),
				success: function (oResponse) {
					try {
						var sContent = oResponse.choices[0].message.content;
						resolve(_parseJsonLoose(sContent));
					} catch (e) {
						reject(new Error("Unexpected OpenRouter response shape"));
					}
				},
				error: function (jqXHR) {
					var sMsg = "OpenRouter request failed";
					try {
						sMsg = jqXHR.responseJSON.error.message || sMsg;
					} catch (e) { /* ignore */ }
					reject(new Error(sMsg));
				}
			});
		});
	}

	// Models occasionally wrap JSON in ```json fences despite instructions - strip those before parsing.
	function _parseJsonLoose(sContent) {
		var sTrimmed = (sContent || "").trim();
		var oFenceMatch = sTrimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
		if (oFenceMatch) {
			sTrimmed = oFenceMatch[1].trim();
		}
		return JSON.parse(sTrimmed);
	}

	return {
		/**
		 * @param {string} sText - free-form message from the user
		 * @returns {Promise<{vkorg:?string, customerQuery:?string, visittypeHint:?string, notes:?string}>}
		 */
		parseVisitIntent: function (sText) {
			var sSystemPrompt = "You extract structured data from a field rep's short message describing a " +
				"customer visit.\nReturn ONLY a JSON object with these keys (use null for anything not mentioned):\n" +
				"{\n" +
				'  "vkorg": string|null,        // a 4-character SAP sales org code, ONLY if explicitly stated (e.g. "3000")\n' +
				'  "customerQuery": string|null, // the customer/company name as the user wrote it, verbatim\n' +
				'  "visittypeHint": string|null, // a short free-text description of the visit type if implied (e.g. "cold call", "follow up", "delivery issue")\n' +
				'  "notes": string|null         // any details about what happened/was discussed, verbatim or lightly trimmed\n' +
				"}\n" +
				"Do not invent values. Do not include any text outside the JSON object.";
			return callOpenRouter(sSystemPrompt, sText);
		},

		/**
		 * @param {string} sQuery - what the user typed
		 * @param {Array<{kunnr:string,name1:string,ort01:string}>} aCandidates - from ZI_DefaultSHVH
		 * @returns {Promise<{kunnr:?string, confidence:number}>}
		 */
		matchCustomer: function (sQuery, aCandidates) {
			var sSystemPrompt = "You match a user's typed customer name (which may contain typos, abbreviations, " +
				"or nicknames) against a list of candidate customers from an SAP system.\n" +
				"Return ONLY a JSON object:\n" +
				"{\n" +
				'  "kunnr": string|null,     // the "kunnr" of the best matching candidate, or null if no candidate is a plausible match\n' +
				'  "confidence": number      // 0-1, your confidence that this is the correct match\n' +
				"}\n" +
				"Only return a non-null kunnr if you are reasonably confident (>0.6). Do not include any text outside the JSON object.";
			var sUserPrompt = 'User typed: "' + sQuery + '"\n\nCandidates:\n' + JSON.stringify(aCandidates, null, 2);
			return callOpenRouter(sSystemPrompt, sUserPrompt);
		},

		/**
		 * @param {string} sNotes - raw notes text
		 * @returns {Promise<{cleaned:string}>}
		 */
		cleanupNotes: function (sNotes) {
			var sSystemPrompt = "You lightly tidy up a field rep's rough visit notes for a permanent record.\n" +
				"Fix obvious typos and grammar, keep it concise (2-3 sentences max), keep it factual, and do NOT " +
				"add any information that wasn't in the original. Keep the same tone/perspective as the original.\n" +
				'Return ONLY a JSON object: { "cleaned": string }';
			return callOpenRouter(sSystemPrompt, sNotes);
		},

		/**
		 * @param {string} sHint - free-text description of the visit type (or the original whole message)
		 * @param {Array<{key:string,text:string}>} aOptions - the actual available visit type options
		 * @returns {Promise<{key:?string, confidence:number}>}
		 */
		matchVisitType: function (sHint, aOptions) {
			var sSystemPrompt = "You match a free-text hint describing a field rep visit against a fixed list of " +
				"available visit type options from an SAP system. The hint's wording will often NOT literally " +
				"overlap with an option's text (e.g. \"first time visiting\" should match an option called " +
				"\"New Store\"), so use your judgement about what the hint actually implies rather than requiring " +
				"literal word overlap.\n" +
				"Return ONLY a JSON object:\n" +
				"{\n" +
				'  "key": string|null,       // the "key" of the best matching option, or null if none plausibly fit\n' +
				'  "confidence": number      // 0-1, your confidence that this is the correct match\n' +
				"}\n" +
				"Only return a non-null key if you are reasonably confident (>0.6). Do not include any text outside the JSON object.";
			var sUserPrompt = 'Hint: "' + sHint + '"\n\nAvailable options:\n' + JSON.stringify(aOptions, null, 2);
			return callOpenRouter(sSystemPrompt, sUserPrompt);
		}
	};
});
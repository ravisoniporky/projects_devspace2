sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"customer/porky/zfieldappchat/util/AIHelper"
], function (Controller, Filter, FilterOperator, MessageToast, MessageBox, AIHelper) {
	"use strict";

	// ---- conversation steps -------------------------------------------------
	var STEP = {
		ASK_VKORG: "ASK_VKORG",
		ASK_CUSTOMER: "ASK_CUSTOMER",
		ASK_VISITTYPE: "ASK_VISITTYPE",
		ASK_NOTES: "ASK_NOTES",
		CONFIRM_NOTES: "CONFIRM_NOTES",
		CONFIRM: "CONFIRM",
		ASK_IMAGES: "ASK_IMAGES",
		DONE: "DONE"
	};

	var DEEP_CHAT_CDN_URL = "https://unpkg.com/deep-chat@2.4.2/dist/deepChat.bundle.js";

	function escapeHtml(s) {
		return String(s)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	return Controller.extend("customer.porky.zfieldappchat.controller.View1", {

		onInit: function () {
			// draft of the visit being built up over the conversation
			this._oVisit = {
				Vkorg: "3000",		// fallback default sales org - overwritten if a user default is found
				Customer: null,
				CustomerName: null,
				Visittype: null,
				VisittypeText: null,
				Notes: "",
				NotesCleaned: null,
				Visitid: null
			};

			this._step = null;
			this._visitTypeCache = null;
			this._firstMessageHandled = false;
			this._pendingChipData = null;
			this._pendingSignals = null;
			this._deepChatStarted = false;

			// These two run in parallel and don't block each other - the chat mounts and greets
			// the user as soon as the script/DOM are ready, regardless of how long the user-default
			// lookup takes. Only the point where we actually need the sales org value (right before
			// asking about it) waits on _userDefaultsReady - see _startConversation.
			this._scriptReady = this._loadDeepChatScript();
			this._userDefaultsReady = this._fetchUserDefaults();
		},

		/**
		 * Looks up the user's default sales org (parid "VKO") and overwrites the fallback if found.
		 * Never rejects - a failed/missing lookup just keeps the "3000" fallback rather than blocking
		 * anything downstream.
		 */
		_fetchUserDefaults: function () {
			var oModel = this.getOwnerComponent().getModel("ZCXA_USERDEFAULT_CDS");
			return new Promise(function (resolve) {
				oModel.read("/ZCXA_USERDEFAULT", {
					success: function (oData) {
						var aResults = (oData && oData.results) || [];
						var oSalesOrg = aResults.find(function (o) { return o.parid === "VKO"; });
						if (oSalesOrg && oSalesOrg.parva) {
							this._oVisit.Vkorg = oSalesOrg.parva;
						}
						resolve();
					}.bind(this),
					error: function () {
						resolve(); // keep the fallback default rather than blocking startup
					}
				});
			}.bind(this));
		},

		onExit: function () {
			if (this._resizeHandler) {
				window.removeEventListener("resize", this._resizeHandler);
			}
			if (this._oFileInput && this._oFileInput.parentNode) {
				this._oFileInput.parentNode.removeChild(this._oFileInput);
			}
			clearTimeout(this._suggestDebounceTimer);
		},

		// ---- Deep Chat bootstrap ---------------------------------------------

		_loadDeepChatScript: function () {
			return new Promise(function (resolve, reject) {
				if (window.customElements && window.customElements.get("deep-chat")) {
					resolve();
					return;
				}
				var oScript = document.createElement("script");
				oScript.type = "module";
				oScript.src = DEEP_CHAT_CDN_URL;
				oScript.onload = function () {
					window.customElements.whenDefined("deep-chat").then(resolve).catch(reject);
				};
				oScript.onerror = function () {
					reject(new Error("Failed to load deep-chat from CDN (" + DEEP_CHAT_CDN_URL + ")"));
				};
				document.head.appendChild(oScript);
			});
		},

		onDeepChatHostRendered: function (oEvent) {
			if (this._deepChatStarted) {
				return; // guard against re-render firing this a second time
			}
			this._deepChatStarted = true;

			this._oHostDom = oEvent.getSource().getDomRef();
			this._scriptReady.then(function () {
				var oDeepChat = document.createElement("deep-chat");
				this._oDeepChat = oDeepChat;

				// configure BEFORE attaching to the DOM - deep-chat decides things like whether to
				// show its default "no connection configured" intro panel inside connectedCallback,
				// which fires the instant the element is inserted. Setting .connect etc. afterward
				// is too late and it falls back to demo behavior instead of using our handler.
				this._applyDeepChatConfig(oDeepChat);

				oDeepChat.style.width = "100%";
				oDeepChat.style.border = "none";
				oDeepChat.style.display = "block";

				// The "input" event is spec'd with composed:true, so it bubbles out through deep-chat's
				// shadow DOM to this listener even though we never touch its internal markup - this is
				// what drives the live customer-suggestion bubble further down.
				oDeepChat.addEventListener("input", this._onDeepChatRawInput.bind(this));

				this._oHostDom.innerHTML = "";
				this._oHostDom.appendChild(oDeepChat);

				// deep-chat needs time to finish initializing after being attached before addMessage/
				// updateMessage/etc. are safe to call ("please wait for chat view to render...").
				// A fixed frame-count delay isn't reliable here - it works on a hard page reload but
				// not on Fiori Launchpad's in-place slide navigation, which apparently delays when the
				// element actually finishes settling. Poll for real evidence it's rendered instead.
				this._waitForDeepChatReady(oDeepChat).then(function () {
					// Percentage height (100%) cascading through Page > VBox > HTML control is
					// fragile - it silently breaks somewhere in that chain and lets the component
					// grow to fit all content instead of staying a fixed, internally-scrolling box.
					// Compute a real pixel height instead, and keep it in sync with the viewport.
					this._syncDeepChatHeight();
					this._resizeHandler = this._syncDeepChatHeight.bind(this);
					window.addEventListener("resize", this._resizeHandler);

					this._setupNativeFileInput();
					this._startConversation();
				}.bind(this));

			}.bind(this)).catch(function (e) {
				MessageToast.show("Couldn't load the chat component: " + e.message);
			});
		},

		_waitForDeepChatReady: function (oDeepChat) {
			return new Promise(function (resolve) {
				var iAttempts = 0;
				var iMaxAttempts = 100; // ~5s at 50ms intervals
				function check() {
					iAttempts++;
					var bReady = !!(oDeepChat.shadowRoot && oDeepChat.shadowRoot.childElementCount > 0);
					if (bReady || iAttempts >= iMaxAttempts) {
						resolve();
						return;
					}
					setTimeout(check, 50);
				}
				check();
			});
		},

		/**
		 * A plain, native file input we fully control - bypasses deep-chat's own file-handling
		 * entirely (its images/connect.handler wiring wasn't reliably reaching us). Triggered
		 * by the "Add Photos" chip via a programmatic .click().
		 */
		_setupNativeFileInput: function () {
			var oInput = document.createElement("input");
			oInput.type = "file";
			oInput.accept = "image/*";
			oInput.multiple = true;
			oInput.style.display = "none";
			oInput.addEventListener("change", this._onNativeFileInputChange.bind(this));
			document.body.appendChild(oInput);
			this._oFileInput = oInput;
		},

		_onNativeFileInputChange: function (oEvent) {
			var aFiles = Array.prototype.slice.call(oEvent.target.files || []);
			oEvent.target.value = ""; // reset so picking the same file again still fires change
			if (aFiles.length === 0) {
				return;
			}
			this._handleFileUpload(aFiles);
		},

		_syncDeepChatHeight: function () {
			if (!this._oDeepChat || !this._oHostDom) {
				return;
			}
			var BOTTOM_MARGIN_PX = 16; // breathing room below the card so the compose bar isn't flush against the screen edge
			var iTop = this._oHostDom.getBoundingClientRect().top;
			var iHeight = Math.max(200, window.innerHeight - iTop - BOTTOM_MARGIN_PX);
			this._oDeepChat.style.height = iHeight + "px";
		},

		_applyDeepChatConfig: function (oDeepChat) {
			oDeepChat.connect = { handler: this._onDeepChatRequest.bind(this) };
			oDeepChat.textInput = {
				placeholder: { text: "Type here..." },
				styles: {
					container: { borderRadius: "999px", border: "1px solid #d6dae0" }
				}
			};
			oDeepChat.avatars = false; // cleaner iMessage-style look - color/side already shows who's who
			oDeepChat.names = false;
			oDeepChat.speechToText = {
				webSpeech: true,
				submitAfterSilence: true // auto-sends once the user stops talking - no manual tap needed
			};
			// textToSpeech intentionally NOT set here - it only reads messages sent via
			// signals.onResponse, not every addMessage() call. We speak bot messages ourselves
			// instead - see _speak(), called from _botSay().

			oDeepChat.style.backgroundColor = "#f5f6f7";

			oDeepChat.messageStyles = {
				default: {
					shared: {
						bubble: {
							maxWidth: "80%",
							borderRadius: "16px",
							fontSize: "0.9rem",
							lineHeight: "1.45",
							padding: "0.55rem 0.85rem"
						}
					},
					user: {
						bubble: { backgroundColor: "#0854a0", color: "#ffffff" }
					},
					ai: {
						bubble: { backgroundColor: "#ffffff", color: "#1d2d3e", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }
					}
				},
				// our quick-reply chips render as an "html" message - unset the default bubble wrapper
				// entirely so the buttons flow freely with their own pill styling, instead of all
				// sitting inside one big grey box
				html: {
					shared: {
						bubble: { backgroundColor: "unset", padding: "0px", maxWidth: "100%", boxShadow: "none" }
					}
				}
			};

			// binds a real click handler (not an inline attribute) to our chip buttons - see
			// https://deepchat.dev/docs/messages/HTML. NOTE: deliberately NOT using deep-chat's own
			// "deep-chat-suggestion-button" class here - it comes with its own native auto-submit
			// behavior that was double-firing alongside this handler (see _showQuickReplies).
			oDeepChat.htmlClassUtilities = {
				"qr-btn": {
					events: { click: this._onChipClick.bind(this) },
					styles: {
						default: {
							margin: "0.2rem",
							fontSize: "0.85rem",
							fontWeight: "600",
							padding: "0.45rem 1rem",
							borderRadius: "999px",
							border: "1.5px solid #0854a0",
							backgroundColor: "#eaf2fb",
							color: "#0854a0",
							boxShadow: "0 1px 2px rgba(8,84,160,0.15)"
						},
						hover: { backgroundColor: "#0854a0", color: "#ffffff" }
					}
				},
				"vkorg-select": {
					events: { change: this._onVkorgSelectChange.bind(this) }
				}
			};

			// deep-chat's official raw-CSS injection point (dropped into its own shadow root) -
			// for the handful of things the JS style objects above can't reach: pseudo-elements,
			// transitions, and its documented message-grouping classes.
			oDeepChat.auxiliaryStyle = `
				::-webkit-scrollbar { width: 6px; }
				::-webkit-scrollbar-thumb { background: #c7d1db; border-radius: 999px; }
				::-webkit-scrollbar-track { background: transparent; }

				.qr-btn { transition: background-color 0.15s ease, color 0.15s ease; }
			`;
		},

		_startConversation: function () {
			this._botSay("Hi! 👋 Describe the whole visit in one message and I'll pull out the customer, " +
				"visit type, and notes automatically — e.g. \"Visited ABC Produce today for the first " +
				"time, they're low on a few items and might reorder soon.\" Or tap through it step by " +
				"step below.");

			// Set the step immediately (not inside the async default-org lookup below) so that if the
			// user starts typing their full message right away, _handleInput routes it correctly
			// instead of silently dropping it while _step is still null.
			this._goTo(STEP.ASK_VKORG);

			this._prefetchSalesOrgs(); // warm the cache in the background so the dropdown is instant if they want it

			// wait here (not before mounting) for the user-default sales org lookup, since this is
			// the first point the actual value matters
			this._userDefaultsReady.then(function () {
				this._askVkorgDefault();
			}.bind(this));
		},

		_askVkorgDefault: function () {
			this._botSay("I'll use sales org " + this._oVisit.Vkorg + " by default — want a different one?");
			this._showQuickReplies([
				{ text: "✅ Use " + this._oVisit.Vkorg, key: "CONFIRM_VKORG" },
				{ text: "🔄 Choose different", key: "CHOOSE_VKORG" },
				{ text: "📝 Record a Visit", key: "RECORD_VISIT" }
			]);
		},

		/**
		 * Fetches the sales org list once and caches it (as a Promise, so concurrent callers share
		 * the same in-flight request rather than double-fetching).
		 */
		_prefetchSalesOrgs: function () {
			if (this._salesOrgPromise) {
				return this._salesOrgPromise;
			}
			var oModel = this.getOwnerComponent().getModel("ZI_DEFAULTSHVH_CDS");
			this._salesOrgPromise = new Promise(function (resolve) {
				oModel.read("/ZBSD_SalesOrganization", {
					urlParameters: { "$top": "100" },
					success: function (oResponse) {
						var aResults = (oResponse && oResponse.results) || [];
						this._salesOrgCache = aResults.map(function (o) {
							// field name for the description varies by service - try the common ones
							var sName = o.ltext || o.salesorgname || o.SalesOrganization_Text || "";
							return { code: o.SalesOrganization, name: sName };
						});
						resolve(this._salesOrgCache);
					}.bind(this),
					error: function () {
						this._salesOrgCache = [];
						resolve([]);
					}.bind(this)
				});
			}.bind(this));
			return this._salesOrgPromise;
		},

		_showSalesOrgDropdown: function () {
			this._setBusy(true);
			this._prefetchSalesOrgs().then(function (aOrgs) {
				this._setBusy(false);
				if (!aOrgs || aOrgs.length === 0) {
					this._botSay("I couldn't load the list — just type a sales org code below.");
					return;
				}
				var sOptions = aOrgs.map(function (o) {
					return '<option value="' + escapeHtml(o.code) + '">' +
						escapeHtml(o.code + (o.name ? " — " + o.name : "")) + "</option>";
				}).join("");
				var sHtml = '<select class="vkorg-select" style="width:100%;padding:0.5rem;' +
					'border-radius:8px;border:1px solid #d6dae0;font-size:0.9rem;">' +
					'<option value="">Select a sales org...</option>' + sOptions + "</select>";
				this._botSayHtml(sHtml);
			}.bind(this));
		},

		_onVkorgSelectChange: function (oEvent) {
			var sValue = oEvent.target.value;
			if (!sValue) {
				return;
			}
			var oOrg = (this._salesOrgCache || []).filter(function (o) { return o.code === sValue; })[0];
			var sLabel = sValue + (oOrg && oOrg.name ? " — " + oOrg.name : "");
			this._userSay(sLabel);
			this._acceptVkorgWithChoice(sValue);
		},

		/**
		 * Used after the sales org is *changed* (via the dropdown) rather than just confirmed as the
		 * default - re-offers the one-shot "Record a Visit" path explicitly, same as the very first
		 * message, since jumping straight to "who's the customer?" reads like customer search is the
		 * only option from here.
		 */
		_acceptVkorgWithChoice: function (sVkorg) {
			this._oVisit.Vkorg = sVkorg;
			this._firstMessageHandled = false; // allow the full AI parse if they type freely or tap Record a Visit
			this._botSay("Sales org " + sVkorg + ". What would you like to do next?");
			this._showQuickReplies([
				{ text: "📝 Record a Visit", key: "RECORD_VISIT" },
				{ text: "🔍 Select Customer", key: "SELECT_CUSTOMER" }
			]);
			this._goTo(STEP.ASK_VKORG);
		},

		// ---- deep-chat request handler (fires when the user submits text or files) ---

		_onDeepChatRequest: function (body, signals) {
			this._pendingSignals = signals;
			if (window.speechSynthesis) {
				window.speechSynthesis.cancel();
			}
			clearTimeout(this._suggestDebounceTimer);
			if (this._liveSuggestMessageIndex != null) {
				this._getDeepChat().updateMessage({ html: "" }, this._liveSuggestMessageIndex);
				this._liveSuggestMessageIndex = null;
			}

			var aMessages = (body && body.messages) || [];
			var sValue = aMessages.length ? (aMessages[aMessages.length - 1].text || "") : "";
			sValue = sValue.trim();

			if (!sValue) {
				signals.onResponse({ text: "" });
				this._pendingSignals = null;
				return;
			}

			this._handleInput(sValue);
		},

		/**
		 * Fires on every keystroke in deep-chat's input, even though it lives in shadow DOM - the
		 * native "input" event is composed:true and bubbles out to this listener on the host element.
		 * Drives the live customer-suggestion bubble while the user is typing during that step.
		 */
		_onDeepChatRawInput: function (oEvent) {
			if (this._step !== STEP.ASK_CUSTOMER) {
				return;
			}

			var oTarget = oEvent.target;
			var sTerm = ((oTarget && oTarget.value) || "").trim();
			clearTimeout(this._suggestDebounceTimer);

			if (sTerm.length < 2) {
				return;
			}

			this._suggestDebounceTimer = setTimeout(function () {
				this._searchCustomers(sTerm).then(function (aSuggestions) {
					if (this._step !== STEP.ASK_CUSTOMER || aSuggestions.length === 0) {
						return;
					}
					this._showQuickReplies(aSuggestions.map(function (o) {
						return { text: o.label, key: o.key, raw: o.raw };
					}), true /* live update in place */);
				}.bind(this));
			}.bind(this), 300);
		},

		// ---- image upload (after visit is created) ---------------------------

		_handleFileUpload: function (aFiles) {
			if (this._step !== STEP.ASK_IMAGES || !this._oVisit.Visitid) {
				this._botSay("I can only attach photos once the visit's been created — let's finish the details first.");
				return;
			}

			this._setBusy(true);
			this._botSay("Uploading " + aFiles.length + " photo" + (aFiles.length > 1 ? "s" : "") + "...");

			var aUploads = aFiles.map(function (oFile) {
				return this._uploadVisitImage(this._oVisit.Visitid, oFile, oFile.name);
			}.bind(this));

			Promise.all(aUploads).then(function (aResults) {
				this._setBusy(false);
				var iOk = aResults.filter(function (r) { return r && r.ok; }).length;
				var iFailed = aResults.length - iOk;
				var sMsg = "✅ " + iOk + " photo" + (iOk === 1 ? "" : "s") + " uploaded" +
					(iFailed > 0 ? ", ❌ " + iFailed + " failed." : ".");
				this._botSay(sMsg);
				this._showQuickReplies([
					{ text: "📷 Add More Photos", key: "ADD_PHOTOS" },
					{ text: "✅ Done", key: "IMAGES_DONE" },
					{ text: "↺ Start Over", key: "RESTART" }
				]);
			}.bind(this));
		},

		_getCsrfToken: function (sServiceUrl) {
			if (this._csrfTokenCache) {
				return Promise.resolve(this._csrfTokenCache);
			}
			return fetch(sServiceUrl, {
				method: "GET",
				credentials: "same-origin",
				headers: { "X-CSRF-Token": "Fetch" }
			}).then(function (oResponse) {
				var sToken = oResponse.headers.get("x-csrf-token");
				this._csrfTokenCache = sToken;
				return sToken;
			}.bind(this));
		},

		_uploadVisitImage: function (sVisitId, oBlob, sFileName) {
			var sServiceUrl = "/sap/opu/odata/sap/ZODATA_FIELDREP_IMAGES_V2_SRV/ZFRVISIT_IMAGESSet?sap-client=100";
			return this._getCsrfToken(sServiceUrl).then(function (sToken) {
				return fetch(sServiceUrl, {
					method: "POST",
					credentials: "same-origin",
					headers: {
						"X-CSRF-Token": sToken,
						"Content-Type": oBlob.type || "image/jpeg",
						"Slug": sVisitId + ";" + sFileName
					},
					body: oBlob
				});
			}).catch(function (e) {
				return { ok: false, error: e };
			});
		},

		// ---- chat plumbing ------------------------------------------------

		_getDeepChat: function () {
			return this._oDeepChat;
		},

		/**
		 * Adds a bot message. If this is the direct reply to whatever the user just typed and
		 * submitted through Deep Chat's own input, route it through the pending "signals" so the
		 * loading indicator clears correctly; otherwise (e.g. a follow-up message pushed later in
		 * the same turn, or a message triggered by a chip tap) just append it directly.
		 */
		_botSay: function (sText) {
			this._speak(sText);
			if (this._pendingSignals) {
				var oSignals = this._pendingSignals;
				this._pendingSignals = null;
				oSignals.onResponse({ text: sText });
			} else {
				this._getDeepChat().addMessage({ text: sText, role: "ai" });
			}
		},

		/**
		 * deep-chat's own textToSpeech only reads messages that flow through the connect/
		 * signals.onResponse pipeline - since _botSay only routes the first reply of a turn that way
		 * and uses addMessage() directly for every follow-up message in the same turn, deep-chat only
		 * "hears" that first one. Speaking every message ourselves via the raw Web Speech API sidesteps
		 * that entirely. (oDeepChat.textToSpeech is left off - see _applyDeepChatConfig - to avoid the
		 * first message of each turn being spoken twice.)
		 */
		_speak: function (sText) {
			if (!window.speechSynthesis || !sText) {
				return;
			}
			window.speechSynthesis.cancel(); // stop whatever's still playing/queued before starting this one
			var oUtterance = new SpeechSynthesisUtterance(sText);
			window.speechSynthesis.speak(oUtterance);
		},

		_botSayHtml: function (sHtml) {
			if (this._pendingSignals) {
				var oSignals = this._pendingSignals;
				this._pendingSignals = null;
				oSignals.onResponse({ html: sHtml });
			} else {
				this._getDeepChat().addMessage({ html: sHtml, role: "ai" });
			}
		},

		_userSay: function (sText) {
			// only needed for chip taps - real typed submissions are already shown by Deep Chat itself
			this._getDeepChat().addMessage({ text: sText, role: "user" });
		},

		_showQuickReplies: function (aReplies, bLiveUpdate) {
			if (!aReplies || aReplies.length === 0) {
				return;
			}
			this._pendingChipData = aReplies;
			var sHtml = '<div style="display:flex;flex-wrap:wrap;justify-content:flex-end;">' +
				aReplies.map(function (o, i) {
					return '<button class="qr-btn" data-index="' + i + '">' + escapeHtml(o.text) + "</button>";
				}).join("") +
				"</div>";

			if (bLiveUpdate && this._liveSuggestMessageIndex != null) {
				// same suggestion bubble refreshed in place as the user keeps typing
				this._getDeepChat().updateMessage({ html: sHtml }, this._liveSuggestMessageIndex);
			} else if (bLiveUpdate) {
				// first suggestion shown this typing session - remember its index for later updates
				var iIndex = this._getDeepChat().getMessages().length;
				this._botSayHtml(sHtml);
				this._liveSuggestMessageIndex = iIndex;
			} else {
				this._botSayHtml(sHtml);
			}
		},

		_onChipClick: function (oEvent) {
			var oTarget = oEvent.currentTarget || oEvent.target;
			var iIndex = parseInt(oTarget.getAttribute("data-index"), 10);
			var oData = this._pendingChipData && this._pendingChipData[iIndex];
			if (!oData) {
				return;
			}
			if (window.speechSynthesis) {
				window.speechSynthesis.cancel();
			}
			this._pendingChipData = null;
			this._userSay(oData.text);
			this._routeQuickReply(oData);
		},


		_setBusy: function (bBusy) {
			var oDeepChat = this._getDeepChat();
			if (oDeepChat && oDeepChat.disableSubmitButton) {
				oDeepChat.disableSubmitButton(bBusy);
			}
		},

		_goTo: function (sStep) {
			this._step = sStep;
			this._liveSuggestMessageIndex = null;
			clearTimeout(this._suggestDebounceTimer);

			var oDeepChat = this._getDeepChat();
			if (oDeepChat && oDeepChat.setPlaceholderText) {
				oDeepChat.setPlaceholderText(this._placeholderForStep(sStep));
			}
		},

		_placeholderForStep: function (sStep) {
			switch (sStep) {
				case STEP.ASK_CUSTOMER: return "Type a customer name...";
				case STEP.ASK_NOTES: return "Type or dictate your notes...";
				case STEP.ASK_IMAGES: return "Tap the image button to attach photos...";
				default: return "Type here...";
			}
		},

		_handleInput: function (sValue) {
			switch (this._step) {
				case STEP.ASK_VKORG:
					this._handleFirstMessage(sValue);
					break;

				case STEP.ASK_CUSTOMER:
					// free-typed text submitted without tapping a chip - parse it fully (not just as
					// a customer name), so a whole visit description still works here too, not only
					// as the very first message before any chip is tapped
					this._parseAndResolveCustomerMessage(sValue);
					break;

				case STEP.ASK_VISITTYPE:
					this._botSay("Please choose a visit type from the options above.");
					break;

				case STEP.ASK_NOTES:
					this._oVisit.Notes = sValue;
					this._offerCleanedNotes(sValue);
					break;

				case STEP.ASK_IMAGES:
					this._botSay("Tap \"Add Photos\" to attach images, or \"Done\" to finish.");
					break;

				default:
					break;
			}
		},

		// ---- AI: parse a whole free-text message in one shot ---------------

		_handleFirstMessage: function (sValue) {
			if (this._firstMessageHandled) {
				// user just typed a sales org directly
				this._acceptVkorg(sValue);
				return;
			}
			this._firstMessageHandled = true;
			this._setBusy(true);

			AIHelper.parseVisitIntent(sValue).then(function (oParsed) {
				this._setBusy(false);

				if (oParsed.vkorg) {
					this._oVisit.Vkorg = oParsed.vkorg;
				}

				// looks like a plain sales org code and nothing else useful was said
				var bLooksLikeJustVkorg = !oParsed.customerQuery && !oParsed.visittypeHint && !oParsed.notes;
				if (bLooksLikeJustVkorg) {
					this._acceptVkorg(oParsed.vkorg || sValue);
					return;
				}

				this._botSay("Got it — sales org " + this._oVisit.Vkorg + ". Let me look into that.");

				if (oParsed.notes) {
					this._oVisit.Notes = oParsed.notes;
				}
				this._oVisit._pendingVisittypeHint = oParsed.visittypeHint || null;

				if (oParsed.customerQuery) {
					this._resolveCustomerFromQuery(oParsed.customerQuery);
				} else {
					this._botSay("Who's the customer? Start typing a name.");
					this._goTo(STEP.ASK_CUSTOMER);
				}
			}.bind(this)).catch(function () {
				this._setBusy(false);
				// AI unavailable - degrade gracefully rather than misreading a full sentence as a
				// literal sales org code. Short code-like input (e.g. "3000") is still treated as
				// a sales org; anything longer/sentence-like falls back to a plain customer search
				// against the current default org instead.
				if (this._looksLikeVkorgCode(sValue)) {
					this._acceptVkorg(sValue);
				} else {
					this._botSay("I couldn't reach the AI assistant, so I'll use sales org " +
						this._oVisit.Vkorg + " and search for that as a customer name.");
					this._resolveCustomerFromQuery(sValue);
				}
			}.bind(this));
		},

		_looksLikeVkorgCode: function (sValue) {
			var sTrimmed = (sValue || "").trim();
			return sTrimmed.length > 0 && sTrimmed.length <= 10 && sTrimmed.indexOf(" ") === -1;
		},

		_acceptVkorg: function (sVkorg) {
			this._oVisit.Vkorg = sVkorg;
			this._botSay("Sales org " + sVkorg + ". Now, who's the customer? Start typing a name.");
			this._goTo(STEP.ASK_CUSTOMER);
		},

		// ---- quick reply routing (chip taps) --------------------------------

		_routeQuickReply: function (oData) {
			switch (this._step) {
				case STEP.ASK_VKORG:
					if (oData.key === "CONFIRM_VKORG") {
						this._firstMessageHandled = true;
						this._acceptVkorg(this._oVisit.Vkorg);
					} else if (oData.key === "CHOOSE_VKORG") {
						this._firstMessageHandled = true;
						this._showSalesOrgDropdown();
					} else if (oData.key === "RECORD_VISIT") {
						// deliberately NOT setting _firstMessageHandled - the next thing they type
						// still needs to go through _handleFirstMessage's full AI parse, not be
						// treated as a literal sales org code
						this._botSay("Go ahead — describe the visit in one message (customer, what " +
							"happened, any notes) and I'll take care of the rest. I'll use sales org " +
							this._oVisit.Vkorg + " unless you mention a different one.");
					} else if (oData.key === "SELECT_CUSTOMER") {
						this._firstMessageHandled = true;
						this._botSay("Who's the customer? Start typing a name.");
						this._goTo(STEP.ASK_CUSTOMER);
					}
					break;

				case STEP.ASK_VISITTYPE:
					this._acceptVisitType(oData.key, oData.text);
					break;

				case STEP.ASK_CUSTOMER:
					if (oData.raw) {
						this._acceptCustomer(oData.key, oData.raw.name1);
					}
					break;

				case STEP.ASK_NOTES:
					if (oData.key === "SKIP_NOTES") {
						this._oVisit.Notes = "";
						this._goToConfirm();
					}
					break;

				case STEP.CONFIRM_NOTES:
					if (oData.key === "USE_CLEANED") {
						this._oVisit.Notes = this._oVisit.NotesCleaned;
					} else if (oData.key === "KEEP_ORIGINAL") {
						// this._oVisit.Notes already holds the original
					}
					this._goToConfirm();
					break;

				case STEP.CONFIRM:
					if (oData.key === "SUBMIT") {
						this._submitVisit();
					} else if (oData.key === "RESTART") {
						this._resetConversation();
					}
					break;

				case STEP.ASK_IMAGES:
					if (oData.key === "ADD_PHOTOS") {
						this._oFileInput.click();
					} else if (oData.key === "SKIP_IMAGES" || oData.key === "IMAGES_DONE") {
						this._showQuickReplies([{ text: "➕ Log another visit", key: "RESTART" }]);
						this._goTo(STEP.DONE);
					} else if (oData.key === "RESTART") {
						this._resetConversation();
					}
					break;

				case STEP.DONE:
					if (oData.key === "RESTART") {
						this._resetConversation();
					}
					break;

				default:
					break;
			}
		},

		// ---- customer resolution: search + AI fuzzy match -------------------

		/**
		 * Runs a ZI_DefaultSHVH search and returns a Promise of suggestion-shaped rows.
		 */
		_searchCustomers: function (sTerm) {
			return new Promise(function (resolve) {
				var oModel = this.getOwnerComponent().getModel(); // ZODATA_FR_SRV

				// substringof() on this backend appears to be case-sensitive, so a plain
				// lowercase-as-typed filter can miss records like "New Brunswick Farmer".
				// OR together a few case variants of the typed term to work around it
				// without needing a backend change.
				var sLower = sTerm.toLowerCase();
				var sUpper = sTerm.toUpperCase();
				var sTitle = sTerm.charAt(0).toUpperCase() + sTerm.slice(1).toLowerCase();

				var aCaseVariants = Array.from(new Set([sTerm, sLower, sUpper, sTitle]));

				// Search across name1, name2, street, and city - not just the customer's primary
				// name - so e.g. a street or city typed instead of the name still finds a match.
				// All combinations (field x case variant) are OR'd together.
				var aSearchFields = ["name1", "name2", "stras", "ort01"];
				var aFieldFilters = [];
				aSearchFields.forEach(function (sField) {
					aCaseVariants.forEach(function (s) {
						aFieldFilters.push(new Filter(sField, FilterOperator.Contains, s));
					});
				});
				var oNameFilter = new Filter({
					filters: aFieldFilters,
					and: false // OR
				});
				var oVkorgFilter = new Filter("vkorg", FilterOperator.EQ, this._oVisit.Vkorg);

				oModel.read("/ZI_DefaultSHVH", {
					filters: [oVkorgFilter, oNameFilter], // top-level array = AND
					urlParameters: { "$top": "15" },
					success: function (oResponse) {
						var aResults = (oResponse && oResponse.results) || [];
						resolve(aResults.map(function (o) {
							return {
								key: o.kunnr,
								label: o.name1 + (o.ort01 ? " — " + o.ort01 : "") + " (" + o.kunnr + ")",
								raw: o
							};
						}));
					},
					error: function () {
						MessageToast.show("Customer search failed. Check the sales org and try again.");
						resolve([]);
					}
				});
			}.bind(this));
		},

		/**
		 * Free-text customer entry (from the AI parse, or the user submitting the box): search,
		 * then let AI pick the best match if confident, otherwise fall back to showing candidates
		 * as tappable chat chips.
		 */
		_resolveCustomerFromQuery: function (sQuery) {
			this._goTo(STEP.ASK_CUSTOMER);
			this._setBusy(true);
			this._searchCustomers(sQuery).then(function (aSuggestions) {
				if (aSuggestions.length === 0) {
					this._setBusy(false);
					this._botSay("I couldn't find a customer matching \"" + sQuery + "\" in sales org " +
						this._oVisit.Vkorg + ". Try typing the name below.");
					return;
				}

				var aCandidates = aSuggestions.map(function (o) {
					return { kunnr: o.raw.kunnr, name1: o.raw.name1, ort01: o.raw.ort01 };
				});

				AIHelper.matchCustomer(sQuery, aCandidates).then(function (oMatch) {
					this._setBusy(false);
					if (oMatch.kunnr && oMatch.confidence > 0.6) {
						var oPicked = aSuggestions.filter(function (o) { return o.key === oMatch.kunnr; })[0];
						this._botSay("I matched that to " + oPicked.raw.name1 + " (" + oMatch.kunnr + ").");
						this._acceptCustomer(oMatch.kunnr, oPicked.raw.name1);
					} else {
						this._botSay("I found a few possible matches for \"" + sQuery + "\" — please pick one:");
						this._showCustomerChips(aSuggestions);
					}
				}.bind(this)).catch(function () {
					this._setBusy(false);
					this._botSay("Here's what I found for \"" + sQuery + "\" — please pick one:");
					this._showCustomerChips(aSuggestions);
				}.bind(this));
			}.bind(this));
		},

		_showCustomerChips: function (aSuggestions) {
			this._showQuickReplies(aSuggestions.map(function (o) {
				return { text: o.label, key: o.key, raw: o.raw };
			}));
		},

		_fuzzyResolveCustomer: function (sTypedText) {
			this._resolveCustomerFromQuery(sTypedText);
		},

		/**
		 * Runs a full AI parse on whatever's typed at the customer step, not just a name search -
		 * this is what keeps "describe the whole visit in one message" working even after the sales
		 * org was already confirmed via chip, not only as the very first message in the conversation.
		 */
		_parseAndResolveCustomerMessage: function (sValue) {
			this._setBusy(true);
			AIHelper.parseVisitIntent(sValue).then(function (oParsed) {
				this._setBusy(false);
				if (oParsed.notes) {
					this._oVisit.Notes = oParsed.notes;
				}
				if (oParsed.visittypeHint) {
					this._oVisit._pendingVisittypeHint = oParsed.visittypeHint;
				}
				this._resolveCustomerFromQuery(oParsed.customerQuery || sValue);
			}.bind(this)).catch(function () {
				// AI unavailable - fall back to a plain name search rather than blocking
				this._setBusy(false);
				this._resolveCustomerFromQuery(sValue);
			}.bind(this));
		},

		_acceptCustomer: function (sKunnr, sName) {
			this._oVisit.Customer = sKunnr;
			this._oVisit.CustomerName = sName;

			var sHint = this._oVisit._pendingVisittypeHint;
			this._loadVisitTypesAndAsk(sHint);
		},

		// ---- visit type value list (from the create service) ---------------

		_loadVisitTypesAndAsk: function (sHint) {
			if (this._visitTypeCache) {
				this._afterVisitTypesLoaded(sHint);
				return;
			}

			var oModel = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS"); // ZRMM_FRVISITV2_CDS
			this._setBusy(true);
			oModel.read("/ZBMM_VISITTYPE", {
				success: function (oResponse) {
					this._setBusy(false);
					var aResults = (oResponse && oResponse.results) || [];
					this._visitTypeCache = aResults.map(function (o) {
						return { text: o.Description, key: o.Value };
					});
					this._afterVisitTypesLoaded(sHint);
				}.bind(this),
				error: function () {
					this._setBusy(false);
					MessageToast.show("Couldn't load visit types.");
					this._botSay("What type of visit is this?");
					this._goTo(STEP.ASK_VISITTYPE);
				}.bind(this)
			});
		},

		_afterVisitTypesLoaded: function (sHint) {
			if (!sHint) {
				this._botSay("What type of visit is this?");
				this._presentVisitTypeChips(this._visitTypeCache);
				return;
			}

			this._setBusy(true);
			var aOptions = this._visitTypeCache.map(function (o) {
				return { key: o.key, text: o.text };
			});

			AIHelper.matchVisitType(sHint, aOptions).then(function (oMatch) {
				this._setBusy(false);
				var oPicked = oMatch.key && this._visitTypeCache.filter(function (o) {
					return o.key === oMatch.key;
				})[0];

				if (oPicked && oMatch.confidence > 0.6) {
					this._botSay("Sounds like a \"" + oPicked.text + "\" visit — is that right?");
					this._showQuickReplies([
						{ text: oPicked.text, key: oPicked.key },
						{ text: "Choose different type", key: "__SHOW_ALL__" }
					]);
					this._goTo(STEP.ASK_VISITTYPE);
				} else {
					this._botSay("What type of visit is this?");
					this._presentVisitTypeChips(this._visitTypeCache);
				}
			}.bind(this)).catch(function () {
				// AI unavailable - fall through to plain chip selection rather than blocking
				this._setBusy(false);
				this._botSay("What type of visit is this?");
				this._presentVisitTypeChips(this._visitTypeCache);
			}.bind(this));
		},

		_presentVisitTypeChips: function (aChips) {
			this._showQuickReplies(aChips);
			this._goTo(STEP.ASK_VISITTYPE);
		},

		_acceptVisitType: function (sKey, sText) {
			if (sKey === "__SHOW_ALL__") {
				this._presentVisitTypeChips(this._visitTypeCache);
				return;
			}
			this._oVisit.Visittype = sKey;
			this._oVisit.VisittypeText = sText;

			if (this._oVisit.Notes) {
				// notes already came in via the AI parse - offer to tidy them up
				this._offerCleanedNotes(this._oVisit.Notes);
			} else {
				this._botSay("Any notes for this visit? (Type them below, or tap Skip.)");
				this._showQuickReplies([{ text: "Skip", key: "SKIP_NOTES" }]);
				this._goTo(STEP.ASK_NOTES);
			}
		},

		// ---- AI: clean up notes before confirm ------------------------------

		_offerCleanedNotes: function (sRawNotes) {
			this._setBusy(true);
			AIHelper.cleanupNotes(sRawNotes).then(function (oResult) {
				this._setBusy(false);
				this._oVisit.NotesCleaned = oResult.cleaned;
				if (oResult.cleaned && oResult.cleaned.trim() !== sRawNotes.trim()) {
					this._botSay("I tidied that up a bit: \"" + oResult.cleaned + "\"");
					this._showQuickReplies([
						{ text: "Use this version", key: "USE_CLEANED" },
						{ text: "Keep my original", key: "KEEP_ORIGINAL" }
					]);
					this._goTo(STEP.CONFIRM_NOTES);
				} else {
					this._goToConfirm();
				}
			}.bind(this)).catch(function () {
				this._setBusy(false);
				this._goToConfirm();
			}.bind(this));
		},

		// ---- confirmation ----------------------------------------------------

		_goToConfirm: function () {
			var oV = this._oVisit;
			var sSummary = "Here's what I've got:\n" +
				"• Sales Org: " + oV.Vkorg + "\n" +
				"• Customer: " + oV.CustomerName + " (" + oV.Customer + ")\n" +
				"• Visit Type: " + (oV.VisittypeText || oV.Visittype) + "\n" +
				"• Notes: " + (oV.Notes || "(none)");

			this._botSay(sSummary);
			this._botSay("Shall I create this visit?");
			this._showQuickReplies([
				{ text: "✅ Create Visit", key: "SUBMIT" },
				{ text: "↺ Start Over", key: "RESTART" }
			]);
			this._goTo(STEP.CONFIRM);
		},

		_resetConversation: function () {
			var oDeepChat = this._getDeepChat();
			if (oDeepChat && oDeepChat.clearMessages) {
				oDeepChat.clearMessages(false);
			}

			this._oVisit = {
				Vkorg: "3000",
				Customer: null,
				CustomerName: null,
				Visittype: null,
				VisittypeText: null,
				Notes: "",
				NotesCleaned: null,
				Visitid: null
			};
			this._step = null;
			this._visitTypeCache = null;
			this._firstMessageHandled = false;
			this._pendingChipData = null;

			// re-apply the user default (in case they picked a different org last round)
			this._userDefaultsReady = this._fetchUserDefaults();
			this._startConversation();
		},

		// ---- deep create -------------------------------------------------

		_submitVisit: function () {
			this._setBusy(true);
			this._botSay("Creating the visit...");

			var oModel = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS"); // ZRMM_FRVISITV2_CDS
			var oV = this._oVisit;
			var sUser = this._getCurrentUserId();

			var oPayload = {
				Delete_mc: true,
				Update_mc: true,
				to_notes_oc: true,
				to_team_oc: true,
				Visitid: "NEW",
				Customer: oV.Customer,
				Vkorg: oV.Vkorg,
				Visittype: oV.Visittype,
				Ernam: "",
				Createdatetime: "/Date(" + Date.now() + ")/",
				to_notes: {
					results: [{
						Delete_mc: true,
						Update_mc: true,
						Visitid: "NEW",
						Lineid: 0,
						Spras: "",
						Type: "N",
						Createdatetime: "/Date(" + Date.now() + ")/",
						Kunnr: "",
						Vkorg: "",
						Notes: oV.Notes || "",
						Ernam: ""
					}]
				},
				to_team: {
					results: [{
						Bname: sUser,
						UserDescription: "Current User"
					}]
				},
				status: "1"
			};

			oModel.create("/ZRMM_FRVISITV2", oPayload, {
				success: function (oData) {
					this._setBusy(false);
					var sNewId = oData && oData.Visitid ? oData.Visitid : "(pending)";
					this._oVisit.Visitid = sNewId;
					this._triggerVisitEmail(sNewId);
					this._botSay("✅ Visit " + sNewId + " created for " + oV.CustomerName + ".");

					var sVisitUrl = this._buildVisitUrl(sNewId);
					this._botSayHtml('<a href="' + sVisitUrl + '" target="_blank" rel="noopener" ' +
						'style="color:#0854a0;font-weight:600;text-decoration:underline;">' +
						"🔗 Open Visit " + escapeHtml(sNewId) + "</a>");

					this._botSay("Want to add any photos from this visit?");
					this._showQuickReplies([
						{ text: "📷 Add Photos", key: "ADD_PHOTOS" },
						{ text: "Skip", key: "SKIP_IMAGES" },
						{ text: "↺ Start Over", key: "RESTART" }
					]);
					this._goTo(STEP.ASK_IMAGES);
					MessageToast.show("Visit created: " + sNewId);
				}.bind(this),
				error: function (oError) {
					this._setBusy(false);
					var sMsg = this._parseODataError(oError);
					this._botSay("❌ Something went wrong creating the visit: " + sMsg);
					this._showQuickReplies([
						{ text: "Try again", key: "SUBMIT" },
						{ text: "↺ Start Over", key: "RESTART" }
					]);
				}.bind(this)
			});
		},

		_buildVisitUrl: function (sVisitId) {
			return window.location.origin +
				"/sap/bc/ui2/flp?sap-client=100&sap-language=EN#Sales-ZFIELDREPVISIT&/newvisit/" +
				encodeURIComponent(sVisitId);
		},

		/**
		 * Fire-and-forget notification email trigger, mirrored from the existing prospect-management
		 * app's triggerEmail(). Adjustments made to fit this app:
		 *   - ZODATA_FR_SRV is this app's unnamed default model, so getModel() takes no argument here.
		 *   - There's no "prospectModel" in this chat flow (that existed in the other app to track
		 *     whether the customer being visited was a prospect vs an existing customer). This
		 *     conversation always resolves an existing customer via ZI_DefaultSHVH, so Prospect is
		 *     hardcoded to '' below - flag this if prospect visits need to be distinguishable here too,
		 *     and I'll wire in real detection instead of the hardcoded default.
		 *   - Uses this._parseODataError() instead of JSON.parse(err.error.message.value), which would
		 *     throw on a plain (non-JSON) error message string.
		 */
		_triggerVisitEmail: function (sVisitid) {
			var oModel = this.getOwnerComponent().getModel(); // ZODATA_FR_SRV (default model in this app)
			var sProspectFlag = ""; // see note above - no prospect tracking in this conversation yet
			var sPath = "/TriggerEmailSet(Visitid='" + sVisitid + "',Webex='',Prospect='" +
				sProspectFlag + "',Vkorg='" + this._oVisit.Vkorg + "')";

			oModel.read(sPath, {
				success: function () {
					// fire-and-forget - no chat message needed for a background notification trigger
				},
				error: function (oError) {
					var sMsg = this._parseODataError(oError);
					MessageBox.error("There was an issue sending the notification email for visit " +
						sVisitid + ". Please check the data and try again.\n\n" + sMsg);
				}.bind(this)
			});
		},

		_getCurrentUserId: function () {
			try {
				var oUserInfo = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("UserInfo");
				if (oUserInfo && oUserInfo.getId()) {
					return oUserInfo.getId().split("@")[0].toUpperCase();
				}
			} catch (e) { /* fall through */ }
			return "";
		},

		_parseODataError: function (oError) {
			try {
				var oBody = JSON.parse(oError.responseText);
				return oBody.error.message.value;
			} catch (e) {
				return oError.message || "unknown error";
			}
		}
	});
});
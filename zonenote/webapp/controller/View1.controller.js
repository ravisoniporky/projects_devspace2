sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/Log",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Item",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "customer/porky/zonenote/localService/localConfig"
], function (Controller, Log, JSONModel, MessageBox, MessageToast, Item, Filter, FilterOperator, localConfig) {
    "use strict";

    return Controller.extend("customer.porky.zonenote.controller.View1", {

        onInit: function () {
            this.OAUTH_TENANT_ID = "63a015da-e3f7-4ac0-8525-d4c3f490e96b";
            this.OAUTH_CLIENT_ID = "4d8e8ba1-194a-48c8-9f45-8f79aad919b8";
            // The only redirect URI registered in Azure AD - the generic FLP shell root,
            // not a page this app controls. See _acquireGraphTokenManual for how we work
            // around that.
            // eslint-disable-next-line @sap-ux/fiori-tools/sap-no-hardcoded-url
            this.OAUTH_REDIRECT_URI = "https://dev.porky.com/sap/bc/ui2/flp";

            // INSECURE - LOCAL TEST ONLY: paste your own OpenRouter API key here for
            // local testing. Never commit a real key here - anyone viewing the deployed
            // app's network tab or page source can read it. Leave blank to skip the
            // "Analyze PDF" data extraction (see _extractDataFromPdfWithOpenRouter).
            // eslint-disable-next-line @sap-ux/fiori-tools/sap-no-hardcoded-url
            this.OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
<<<<<<< HEAD
            this.OPENROUTER_API_KEY = "REMOVED";
=======
            this.OPENROUTER_API_KEY = localConfig.OPENROUTER_API_KEY;
>>>>>>> a75e4ee6 (commit)
            this.OPENROUTER_MODEL = "anthropic/claude-opus-4.7";

            // Set by whichever "fetch pages" flow last ran, so the page picker below
            // can (re-)extract whatever page the user selects using the right
            // auth context, instead of always grabbing pages[0].
            this._fnExtractSelectedPage = null;
            // Same idea, but for the separate "Extract from URL" tab's own page picker -
            // kept entirely separate from the above so that tab can never overwrite the
            // "My Notes" tab's state or vice versa.
            this._fnExtractUrlSelectedPage = null;

            var oModel = new JSONModel({
                pages: [],
                sections: [],
                selectedSectionId: "",
                selectedPageId: "",
                selectedPageItems: [],
                selectedPageHtml: "",
                selectedPageHtmlRendered: "",
                pdfExtraction: null,
                pdfExtractionError: "",
                urlNoteUrl: "",
                urlPages: [],
                urlSections: [],
                urlSelectedSectionId: "",
                urlSelectedPageId: "",
                urlSelectedPageItems: [],
                urlSelectedPageHtml: "",
                urlSelectedPageHtmlRendered: "",
                urlPdfExtraction: null,
                urlPdfExtractionError: ""
            });
            this.getView().setModel(oModel, "onenote");

            this._bindSectionAndPagePickers(this.byId("myNotesSectionSelect"), this.byId("myNotesPageSelect"), "/sections", "/pages");
            this._bindSectionAndPagePickers(this.byId("urlSectionSelect"), this.byId("urlPageSelect"), "/urlSections", "/urlPages");
        },

        /**
         * Wires a Section ComboBox + Page ComboBox pair once at startup: the section
         * picker lists the unique _sectionName values seen across the fetched pages (see
         * _sectionName tagging in _listPagesFromDriveItem, _findPagesInMatchingSections
         * and _fetchPagesInNotebook), and the page picker lists every fetched page - later
         * narrowed to the selected section's pages by _filterPagesForSection, so the UI
         * mirrors OneNote's own section -> pages drill-down instead of one flat page list.
         */
        _bindSectionAndPagePickers: function (oSectionComboBox, oPageComboBox, sSectionsPath, sPagesPath) {
            oSectionComboBox.bindItems({
                path: "onenote>" + sSectionsPath,
                template: new Item({ key: "{onenote>name}", text: "{onenote>name}" })
            });
            oPageComboBox.bindItems({
                path: "onenote>" + sPagesPath,
                template: new Item({ key: "{onenote>id}", text: "{onenote>title}" })
            });
        },

        /**
         * Collects the unique _sectionName values from a fetched page list, in first-seen
         * order (pages from the same section are already contiguous in the source array,
         * since every fetch path appends one section's pages at a time), for use as the
         * Section ComboBox's items.
         */
        _deriveSectionNames: function (aPages) {
            var aNames = [];
            for (var i = 0; i < aPages.length; i++) {
                var sName = aPages[i]._sectionName || "Section";
                if (aNames.indexOf(sName) === -1) {
                    aNames.push(sName);
                }
            }
            return aNames.map(function (sSectionName) { return { name: sSectionName }; });
        },

        /**
         * Bound to the Section ComboBox's selectionChange: re-filters the paired Page
         * ComboBox's items binding down to the chosen section and defaults the page
         * picker to that section's first page.
         */
        _filterPagesForSection: function (oPageComboBox, sPagesPath, sSelectedSectionPath, sSelectedPagePath) {
            var oModel = this.getView().getModel("onenote");
            var sSectionName = oModel.getProperty(sSelectedSectionPath);
            oPageComboBox.getBinding("items").filter(
                sSectionName ? [new Filter("_sectionName", FilterOperator.EQ, sSectionName)] : []);

            var aAllPages = oModel.getProperty(sPagesPath) || [];
            var oFirstMatch = aAllPages.find(function (oPage) {
                return !sSectionName || oPage._sectionName === sSectionName;
            });
            oModel.setProperty(sSelectedPagePath, oFirstMatch ? oFirstMatch.id : "");
        },

        onMyNotesSectionChange: function () {
            this._filterPagesForSection(this.byId("myNotesPageSelect"), "/pages", "/selectedSectionId", "/selectedPageId");
        },

        onUrlSectionChange: function () {
            this._filterPagesForSection(this.byId("urlPageSelect"), "/urlPages", "/urlSelectedSectionId", "/urlSelectedPageId");
        },

        /**
         * Tracks the currently fetched page list and remembers which context (fnExtract)
         * can (re-)extract any of them, so the page picker can switch to a different page
         * later without re-running sign-in. Also (re)populates the section picker and
         * defaults it to the first section, which in turn filters the page picker.
         */
        _setPagesAndExtractor: function (aPages, fnExtract) {
            var oModel = this.getView().getModel("onenote");
            oModel.setProperty("/pages", aPages);
            var aSections = this._deriveSectionNames(aPages);
            oModel.setProperty("/sections", aSections);
            oModel.setProperty("/selectedSectionId", aSections.length > 0 ? aSections[0].name : "");
            this._fnExtractSelectedPage = fnExtract;
            this._filterPagesForSection(this.byId("myNotesPageSelect"), "/pages", "/selectedSectionId", "/selectedPageId");
        },

        _extractSelectedPage1: function () {
            var sPageId = this.getView().getModel("onenote").getProperty("/selectedPageId");
            if (!sPageId) {
                return MessageBox.warning("No page selected.");
            }
            if (!this._fnExtractSelectedPage) {
                return MessageBox.warning("Fetch pages first using Sign in with Microsoft or a recent notebook.");
            }
            return this._fnExtractSelectedPage(sPageId);
        },

        /**
         * Bound to the page picker's "Extract Selected Page" button, so switching the
         * dropdown to a different page re-extracts it using whichever context was last
         * used to fetch the page list.
         */
        onExtractSelectedPagePress: async function () {
            var oView = this.getView();
            oView.setBusy(true);

            try {
                await this._extractSelectedPage();
                MessageToast.show("Successfully extracted selected OneNote page.");
            } catch (oError) {
                Log.error(oError);
                MessageBox.error("Extraction failed: " + oError.message);
            } finally {
                oView.setBusy(false);
            }
        },

        /**
         * Mirrors _setPagesAndExtractor/_extractSelectedPage/onExtractSelectedPagePress
         * above, but for the separate "Extract from URL" tab's own page picker, so that
         * tab's state never touches "My Notes"'s /pages, /selectedPageId, etc.
         */
        _setUrlPagesAndExtractor: function (aPages, fnExtract) {
            var oModel = this.getView().getModel("onenote");
            oModel.setProperty("/urlPages", aPages);
            var aSections = this._deriveSectionNames(aPages);
            oModel.setProperty("/urlSections", aSections);
            oModel.setProperty("/urlSelectedSectionId", aSections.length > 0 ? aSections[0].name : "");
            this._fnExtractUrlSelectedPage = fnExtract;
            this._filterPagesForSection(this.byId("urlPageSelect"), "/urlPages", "/urlSelectedSectionId", "/urlSelectedPageId");
        },

        _extractUrlSelectedPage: function () {
            var sPageId = this.getView().getModel("onenote").getProperty("/urlSelectedPageId");
            if (!sPageId) {
                return MessageBox.warning("No page selected.");
            }
            if (!this._fnExtractUrlSelectedPage) {
                return MessageBox.warning("Extract from a URL first.");
            }
            return this._fnExtractUrlSelectedPage(sPageId);
        },

        /**
 * Builds the OneNote API base path for a given "owner" - either the signed-in user
 * ("me") or another user's mailbox ("users/{email}"). Shared notebooks are frequently
 * NOT enumerable under /me/onenote even when Graph will happily serve them under
 * /users/{owner}/onenote with the same delegated token, since the shared notebook is
 * more reliably associated with the *owner's* OneNote namespace than the viewer's.
 */
_onenoteBase: function (sPathSegment) {
    // eslint-disable-next-line @sap-ux/fiori-tools/sap-no-hardcoded-url
    return "https://graph.microsoft.com/v1.0/" + sPathSegment + "/onenote";
},

/**
 * List-only counterpart to page content extraction: walks a driveItem's notebook ->
 * sections -> pages structure and returns the page list WITHOUT fetching content.
 * Tries several (pathSegment, notebookId) combinations in order, since neither the
 * driveItem's own id nor the /me/ namespace can be assumed to work for a shared
 * notebook (see 20112 errors / name-not-found above):
 *   1. /me/onenote/notebooks/{driveItem.id}            - owns it outright, id lines up
 *   2. /users/{owner}/onenote/notebooks/{driveItem.id} - shared, but id still lines up
 *   3. /users/{owner}/onenote/notebooks + name match    - id doesn't line up at all
 *   4. /me/onenote/notebooks + name match                - last resort
 * Returns { pages, pathSegment } - pathSegment must be reused for the later
 * per-page content fetch, since /me/ and /users/{owner}/ are different namespaces.
 */
_listPagesFromDriveItem: async function (sToken, oDriveItem, sOwnerUserId) {
    if (!oDriveItem || !oDriveItem.package || oDriveItem.package.type !== "oneNote") {
        throw new Error("Resolved item is not a OneNote notebook.");
    }

    var aCandidates = [
        { pathSegment: "me", notebookId: oDriveItem.id }
    ];
    if (sOwnerUserId) {
        aCandidates.push({ pathSegment: "users/" + sOwnerUserId, notebookId: oDriveItem.id });
    }

    var aSections = [];
    var sResolvedPathSegment = "";

    for (var c = 0; c < aCandidates.length && aSections.length === 0; c++) {
        try {
            aSections = await this._fetchAllGraphPages(
                this._onenoteBase(aCandidates[c].pathSegment) + "/notebooks/" + aCandidates[c].notebookId + "/sections?$top=100", sToken);
            if (aSections.length > 0) {
                sResolvedPathSegment = aCandidates[c].pathSegment;
            }
        } catch (oIdError) {
            Log.info("Notebook id lookup failed under " + aCandidates[c].pathSegment + ": " + oIdError.message);
        }
    }

    // Fall back to name-matching, owner's namespace first (more likely to list a
    // notebook it owns than your own /me/ namespace is to have it shared into it).
    if (aSections.length === 0 && oDriveItem.name) {
        var aNamePathSegments = sOwnerUserId ? ["users/" + sOwnerUserId, "me"] : ["me"];
        for (var p = 0; p < aNamePathSegments.length && aSections.length === 0; p++) {
            try {
                var aNotebooks = await this._fetchAllGraphPages(
                    this._onenoteBase(aNamePathSegments[p]) + "/notebooks?$top=100", sToken);
                var sQuery = oDriveItem.name.toLowerCase();
                var oMatch = aNotebooks.find(function (oNotebook) {
                    return oNotebook.displayName && oNotebook.displayName.toLowerCase() === sQuery;
                });
                if (oMatch) {
                    aSections = await this._fetchAllGraphPages(
                        this._onenoteBase(aNamePathSegments[p]) + "/notebooks/" + oMatch.id + "/sections?$top=100", sToken);
                    if (aSections.length > 0) {
                        sResolvedPathSegment = aNamePathSegments[p];
                    }
                }
            } catch (oNameError) {
                Log.info("Name-match lookup failed under " + aNamePathSegments[p] + ": " + oNameError.message);
            }
        }
    }

    if (aSections.length === 0) {
        throw new Error("Could not locate notebook \"" + oDriveItem.name + "\" under /me/ or /users/" +
            (sOwnerUserId || "?") + "/ onenote namespaces. It may not be shared with the signed-in user, " +
            "or Notes.Read.All may need admin consent for application-level access to read another user's notebook regardless of sharing.");
    }

    var aAllPages = [];
    for (var i = 0; i < aSections.length; i++) {
        var aSectionPages = await this._fetchAllGraphPages(
            this._onenoteBase(sResolvedPathSegment) + "/sections/" + aSections[i].id + "/pages?$top=100", sToken);
        aSectionPages.forEach(function (oPage) {
            oPage._sectionName = aSections[i].displayName || "Section";
            oPage._sectionId = aSections[i].id;
        });
        aAllPages = aAllPages.concat(aSectionPages);
    }

    return { pages: aAllPages, pathSegment: sResolvedPathSegment };
},

/**
 * Fetches and parses content for exactly ONE page, under whichever namespace
 * (pathSegment) _listPagesFromDriveItem resolved successfully - "me" or
 * "users/{owner}". Passing the wrong namespace here (e.g. always "me") will 404
 * even for pages that listed successfully, since page ids are namespace-scoped too.
 */
_extractDriveItemPageContent: async function (sToken, sPathSegment, sPageId) {
    var oContentResponse = await fetch(
        this._onenoteBase(sPathSegment) + "/pages/" + sPageId + "/content?page_level_html=true",
        { headers: { "Authorization": "Bearer " + sToken } });
    if (!oContentResponse.ok) { throw new Error("Failed to fetch page content from Microsoft Graph (" + oContentResponse.status + ")."); }

    var sHtml = await oContentResponse.text();
    var oParsed = await this._parseItemsFromHtml(sHtml, function (sSrc) {
        return fetch(sSrc, { headers: { "Authorization": "Bearer " + sToken } })
            .then(function (oImgResponse) { return oImgResponse.ok ? oImgResponse.blob() : null; });
    });
    this.getView().getModel("onenote").setProperty("/urlSelectedPageItems", oParsed.items);
    this.getView().getModel("onenote").setProperty("/urlSelectedPageHtml", sHtml);
    this.getView().getModel("onenote").setProperty("/urlSelectedPageHtmlRendered", oParsed.html);
},

        onExtractUrlSelectedPagePress: async function () {
            var oView = this.getView();
            oView.setBusy(true);

            try {
                await this._extractUrlSelectedPage();
                MessageToast.show("Successfully extracted selected OneNote page.");
            } catch (oError) {
                Log.error(oError);
                MessageBox.error("Extraction failed: " + oError.message);
            } finally {
                oView.setBusy(false);
            }
        },

        /* eslint-disable @sap-ux/fiori-tools/sap-no-hardcoded-url */
        /**
         * Triggers an interactive Microsoft sign-in (Authorization Code + PKCE, no secret
         * involved) and reads OneNote for whoever signs in - all notebooks, owned and
         * shared, via a full notebooks -> sections -> pages walk (see
         * _findPagesInMatchingSections). Does NOT use MSAL's built-in popup handling:
         * the only redirect URI registered in Azure AD is the Fiori Launchpad shell
         * root, a page this app does not control, so MSAL's own popup-completion logic
         * can never run there. Instead this polls the popup's URL from the opener and
         * closes it itself the instant the auth response is readable - a race against
         * the FLP shell's own bootstrap script, which it should reliably win since that
         * boot takes far longer than reading a URL.
         */
        onExtractViaLoginPress: async function () {
            var oView = this.getView();
            oView.setBusy(true);

            try {
                Log.info("Signing in with Microsoft to fetch OneNote pages (all notebooks, including shared)...");
                var sToken = await this._acquireGraphTokenManual();
                var aPages = await this._findPagesInMatchingSections(sToken, "");
                this._setPagesAndExtractor(aPages, this._extractDelegatedPageContentForUser.bind(this, "me", sToken));

                if (aPages.length === 0) {
                    MessageBox.warning("No pages found.");
                    return;
                }

                await this._extractSelectedPage();
                MessageToast.show("Successfully extracted OneNote assets (signed-in user).");

            } catch (oError) {
                Log.error(oError);
                MessageBox.error("Sign-in / extraction failed: " + oError.message);
            } finally {
                oView.setBusy(false);
            }
        },

        /**
         * /me/onenote/pages does not include pages from notebooks that are shared with
         * you rather than owned by you, but /me/onenote/notebooks does list both. This
         * walks notebooks -> sections -> pages, only fetching pages for sections whose
         * name matches sSectionNameQuery, so it stays reasonably fast even with several
         * notebooks. sSectionNameQuery is optional - pass "" (or omit) to walk every
         * section in every accessible notebook with no filtering, which is what the
         * plain sign-in above uses so it "just works" without any extra input.
         */
        _findPagesInMatchingSections: async function (sToken, sSectionNameQuery) {
            var sQuery = (sSectionNameQuery || "").toLowerCase();
            var aNotebooks = await this._fetchAllGraphPages("https://graph.microsoft.com/v1.0/me/onenote/notebooks?$top=100", sToken);
            var aMatchedPages = [];

            for (var i = 0; i < aNotebooks.length; i++) {
                var aSections = await this._fetchAllGraphPages(
                    "https://graph.microsoft.com/v1.0/me/onenote/notebooks/" + aNotebooks[i].id + "/sections?$top=100", sToken);

                for (var j = 0; j < aSections.length; j++) {
                    if (sQuery && (!aSections[j].displayName || aSections[j].displayName.toLowerCase().indexOf(sQuery) === -1)) {
                        continue;
                    }
                    var aSectionPages = await this._fetchAllGraphPages(
                        "https://graph.microsoft.com/v1.0/me/onenote/sections/" + aSections[j].id + "/pages?$top=100", sToken);
                    var sSectionDisplayName = aSections[j].displayName || "Section";
                    for (var k = 0; k < aSectionPages.length; k++) {
                        aSectionPages[k]._sectionName = sSectionDisplayName;
                        aSectionPages[k]._sectionId = aSections[j].id;
                    }
                    aMatchedPages = aMatchedPages.concat(aSectionPages);
                }
            }

            return aMatchedPages;
        },

        /**
         * Separate tab, separate state (/urlPages, /urlSelectedPageItems, etc.) from
         * "My Notes" above - nothing here touches /pages or /selectedPageItems.
         * Requires being signed in first: _acquireGraphTokenManual reuses the cached
         * token from "My Notes" if that ran already, otherwise it triggers the same
         * login popup here.
         *
         * Parses the pasted URL for the owning user (informational only - see below)
         * and a name to search for, then looks for a matching SECTION first (URLs with
         * a "wd=target(Section.one|...)" deep link) and falls back to matching a
         * NOTEBOOK by name (URLs with a "file=" or "RootFolder=" param instead, which
         * point at a notebook rather than one specific section). If neither matches,
         * all of your accessible pages are shown so the page can still be picked
         * manually. Deliberately does not query /users/{owner}/onenote/... directly -
         * that only works if the owner's OneDrive is independently resolvable by
         * Graph, which frequently isn't true; sharing instead grants access through
         * your own /me/onenote/notebooks, which lists notebooks you own AND ones
         * shared with you.
         */
        onExtractFromUrlPress: async function () {
            var oView = this.getView();
            var oModel = oView.getModel("onenote");

            var oParsed;
            try {
                oParsed = this._parseOneNoteUrl(oModel.getProperty("/urlNoteUrl"));
            } catch (oParseError) {
                MessageBox.error("Could not parse that URL: " + oParseError.message);
                return;
            }

            oView.setBusy(true);

            try {
                Log.info("Signing in (if needed) to search for \"" + oParsed.name + "\" (shared by " + oParsed.userId + ")...");
                var sToken = await this._acquireGraphTokenManual();
                var oResult = await this._resolveUrlToPages(sToken, oParsed, oModel.getProperty("/urlNoteUrl"));

                this._urlPathSegment = oResult.pathSegment;
                this._setUrlPagesAndExtractor(oResult.pages, oResult.extractor);

                if (oResult.pages.length === 0) {
                    MessageBox.warning("No pages found.");
                    return;
                }

                if (!oResult.matched) {
                    MessageToast.show("No notebook/section" + (oParsed.name ? " named \"" + oParsed.name + "\"" : "") +
                        " found among your notebooks - showing all your pages instead; pick one manually.");
                }

                await this._extractUrlSelectedPage();

                if (oResult.matched) {
                    MessageToast.show("Successfully extracted OneNote assets from URL.");
                }

            } catch (oError) {
                Log.error(oError);
                MessageBox.error("Extraction failed: " + oError.message);
            } finally {
                oView.setBusy(false);
            }
        },

        /**
         * Tries, in order: a section name parsed from the URL, a notebook name parsed
         * from the URL, the Graph Shares API's authoritative driveItem (both its id
         * directly as a notebook id, and its real name), and finally falls back to
         * every page you can see. Returns { pages, pathSegment, extractor, matched }.
         */
        _resolveUrlToPages: async function (sToken, oParsed, sRawUrl) {
            var fnMeExtractor = this._extractDelegatedPageContentForUrlTab.bind(this, "me", sToken);

            var aPages = oParsed.name ? await this._findPagesInMatchingSections(sToken, oParsed.name) : [];
            if (aPages.length === 0 && oParsed.name) {
                aPages = await this._findPagesInNotebookByName(sToken, oParsed.name);
            }
            if (aPages.length > 0) {
                return { pages: aPages, pathSegment: "me", extractor: fnMeExtractor, matched: true };
            }

            // Our own regex-based name guess from the URL's query params might just be
            // wrong (or the URL doesn't carry a name at all) - the Graph Shares API
            // resolves the URL itself to its underlying resource, which is authoritative
            // for both its real name and its driveItem id.
            var oDriveItem = await this._resolveSharingUrlToDriveItem(sToken, sRawUrl);

            if (oDriveItem && oDriveItem.package && oDriveItem.package.type === "oneNote") {
                var sOwnerEmail = this._resolveOwnerEmail(oDriveItem, oParsed); // driveItem wins over URL guess

                try {
                    var oListResult = await this._listPagesFromDriveItem(sToken, oDriveItem, sOwnerEmail);
                    if (oListResult.pages.length > 0) {
                        return {
                            pages: oListResult.pages,
                            pathSegment: oListResult.pathSegment,
                            extractor: this._extractDriveItemPageContent.bind(this, sToken, oListResult.pathSegment),
                            matched: true
                        };
                    }
                } catch (oListError) {
                    Log.info("Notebook lookup via driveItem failed: " + oListError.message);
                }

                if (oDriveItem.name && oDriveItem.name.toLowerCase() !== (oParsed.name || "").toLowerCase()) {
                    aPages = await this._findPagesInMatchingSections(sToken, oDriveItem.name);
                    if (aPages.length === 0) {
                        aPages = await this._findPagesInNotebookByName(sToken, oDriveItem.name);
                    }
                    if (aPages.length > 0) {
                        return { pages: aPages, pathSegment: "me", extractor: fnMeExtractor, matched: true };
                    }
                }
            }

            aPages = await this._findPagesInMatchingSections(sToken, "");
            return { pages: aPages, pathSegment: "me", extractor: fnMeExtractor, matched: false };
        },

        _parseOneNoteUrl: function (sUrl) {
            if (!sUrl) {
                throw new Error("Please paste a OneNote/SharePoint URL first.");
            }

            var oUrl;
            try {
                oUrl = new URL(sUrl);
            } catch (oUrlError) { // eslint-disable-line no-unused-vars
                throw new Error("That doesn't look like a valid URL.");
            }

            var oPersonalMatch = /\/personal\/([^/]+)\//.exec(oUrl.pathname);
            if (!oPersonalMatch) {
                throw new Error("Couldn't find a /personal/<site>/ segment in that URL.");
            }

            var aParts = oPersonalMatch[1].split("_");
            if (aParts.length < 3) {
                throw new Error("Couldn't determine the user's email from that URL.");
            }
            var sUserId = aParts.slice(0, -2).join("_") + "@" + aParts.slice(-2).join(".");

            // Two URL shapes seen in practice: a deep link to one section via
            // "wd=target(Section.one|...)", or a general notebook link that instead
            // carries a "file=<name>" param (or, failing that, a RootFolder path ending
            // in the notebook name).
            var sName = "";
            var sWd = oUrl.searchParams.get("wd");
            if (sWd) {
                var oSectionMatch = /target\(([^|]+)\.one\|/.exec(sWd);
                if (oSectionMatch) {
                    sName = oSectionMatch[1];
                }
            }
            if (!sName) {
                sName = oUrl.searchParams.get("file") || "";
            }
            if (!sName) {
                var aFolderParts = (oUrl.searchParams.get("RootFolder") || "").split("/").filter(Boolean);
                sName = aFolderParts.length > 0 ? decodeURIComponent(aFolderParts[aFolderParts.length - 1]) : "";
            }

            return { userId: sUserId, name: sName };
        },

        /**
         * Resolves a sharing URL to its underlying driveItem via the Graph Shares API -
         * an authoritative alternative to guessing a name from the URL's own query
         * params, and (for OneNote-package driveItems) a source of the notebook's real
         * id too. Per Graph's documented encoding: base64url-encode the URL as UTF-8
         * and prepend "u!". Returns null (rather than throwing) if the URL can't be
         * resolved this way, so callers can fall back to other sources.
         */
        _resolveSharingUrlToDriveItem: async function (sToken, sUrl) {
            try {
                var sSharingToken = "u!" + this._base64UrlEncode(new TextEncoder().encode(sUrl));
                var oResponse = await fetch("https://graph.microsoft.com/v1.0/shares/" + sSharingToken + "/driveItem", {
                    headers: { "Authorization": "Bearer " + sToken }
                });
                return oResponse.ok ? await oResponse.json() : null;
            } catch (oError) {
                Log.error("Shares API resolution failed: " + oError.message);
                return null;
            }
        },

        /**
         * Resolves a name to a real notebook id by matching it against the full
         * /me/onenote/notebooks list, then returns every page in that notebook.
         */
        _findPagesInNotebookByName: async function (sToken, sDisplayName) {
            var aNotebooks = await this._fetchAllGraphPages("https://graph.microsoft.com/v1.0/me/onenote/notebooks?$top=100", sToken);
            var sQuery = sDisplayName.toLowerCase();
            var oMatch = aNotebooks.find(function (oNotebook) {
                return oNotebook.displayName && oNotebook.displayName.toLowerCase() === sQuery;
            });

            return oMatch ? this._fetchPagesInNotebook(sToken, oMatch.id) : [];
        },

        _fetchPagesInNotebook: async function (sToken, sNotebookId) {
            var aSections = await this._fetchAllGraphPages(
                "https://graph.microsoft.com/v1.0/me/onenote/notebooks/" + sNotebookId + "/sections?$top=100", sToken);

            var aPages = [];
            for (var i = 0; i < aSections.length; i++) {
                var aSectionPages = await this._fetchAllGraphPages(
                    "https://graph.microsoft.com/v1.0/me/onenote/sections/" + aSections[i].id + "/pages?$top=100", sToken);
                var sSectionDisplayName = aSections[i].displayName || "Section";
                for (var k = 0; k < aSectionPages.length; k++) {
                    aSectionPages[k]._sectionName = sSectionDisplayName;
                    aSectionPages[k]._sectionId = aSections[i].id;
                }
                aPages = aPages.concat(aSectionPages);
            }
            return aPages;
        },

        /**
         * Same fetch/parse as _extractDelegatedPageContentForUser, but writes to
         * /urlSelectedPageItems instead of /selectedPageItems, kept as a separate
         * function (rather than a shared one with a path parameter) so the "My Notes"
         * tab's extraction code path is untouched.
         */
        _extractDelegatedPageContentForUrlTab: async function (sUserPathSegment, sToken, sPageId) {
            var oContentResponse = await fetch("https://graph.microsoft.com/v1.0/" + sUserPathSegment + "/onenote/pages/" + sPageId + "/content?page_level_html=true", {
                headers: { "Authorization": "Bearer " + sToken }
            });
            if (!oContentResponse.ok) { throw new Error("Failed to fetch page content from Microsoft Graph (" + oContentResponse.status + ")."); }
            var sHtml = await oContentResponse.text();
            var oParsed = await this._parseItemsFromHtml(sHtml, function (sSrc) {
                return fetch(sSrc, { headers: { "Authorization": "Bearer " + sToken } })
                    .then(function (oImgResponse) { return oImgResponse.ok ? oImgResponse.blob() : null; });
            });
            this.getView().getModel("onenote").setProperty("/urlSelectedPageItems", oParsed.items);
            this.getView().getModel("onenote").setProperty("/urlSelectedPageHtml", sHtml);
            this.getView().getModel("onenote").setProperty("/urlSelectedPageHtmlRendered", oParsed.html);
        },

        /**
         * Graph paginates /onenote/pages (a default-sized batch per call, with the rest
         * reachable via @odata.nextLink) - without following it, only the first batch is
         * ever seen, which silently hides pages from notebooks added later or sorted
         * later in the list. This follows every nextLink until Graph stops returning one.
         */
        _fetchAllGraphPages: async function (sUrl, sToken) {
            var aAll = [];
            var sNextUrl = sUrl;
            while (sNextUrl) {
                var oResponse = await fetch(sNextUrl, { headers: { "Authorization": "Bearer " + sToken } });
                if (!oResponse.ok) { throw new Error("Failed to fetch pages from Microsoft Graph (" + oResponse.status + ")."); }
                var oData = await oResponse.json();
                aAll = aAll.concat(oData.value || []);
                sNextUrl = oData["@odata.nextLink"] || null;
            }
            return aAll;
        },

        _extractDelegatedPageContentForUser: async function (sUserPathSegment, sToken, sPageId) {
            var oContentResponse = await fetch("https://graph.microsoft.com/v1.0/" + sUserPathSegment + "/onenote/pages/" + sPageId + "/content?page_level_html=true", {
                headers: { "Authorization": "Bearer " + sToken }
            });
            if (!oContentResponse.ok) { throw new Error("Failed to fetch page content from Microsoft Graph (" + oContentResponse.status + ")."); }
            var sHtml = await oContentResponse.text();
            var oParsed = await this._parseItemsFromHtml(sHtml, function (sSrc) {
                return fetch(sSrc, { headers: { "Authorization": "Bearer " + sToken } })
                    .then(function (oImgResponse) { return oImgResponse.ok ? oImgResponse.blob() : null; });
            });
            this.getView().getModel("onenote").setProperty("/selectedPageItems", oParsed.items);
            this.getView().getModel("onenote").setProperty("/selectedPageHtml", sHtml);
            this.getView().getModel("onenote").setProperty("/selectedPageHtmlRendered", oParsed.html);
        },

        _base64UrlEncode: function (aBytes) {
            var sBinary = "";
            for (var i = 0; i < aBytes.length; i++) {
                sBinary += String.fromCharCode(aBytes[i]);
            }
            return window.btoa(sBinary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        },

        _generateRandomString: function () {
            var aRandom = new Uint8Array(32);
            window.crypto.getRandomValues(aRandom);
            return this._base64UrlEncode(aRandom);
        },

        _generatePkceChallenge: async function (sVerifier) {
            var aEncoded = new TextEncoder().encode(sVerifier);
            var aDigest = await window.crypto.subtle.digest("SHA-256", aEncoded);
            return this._base64UrlEncode(new Uint8Array(aDigest));
        },

        /**
         * Opens the Microsoft login popup and polls its location from here (the opener).
         * Cross-origin reads of popup.location.href throw while it's still on
         * login.microsoftonline.com; once it navigates back to our redirect URI, the read
         * succeeds and we close the popup immediately, before the FLP shell it just loaded
         * has a chance to run its own bootstrap and show an error.
         */
        _openLoginPopupAndGetCode: function (sAuthUrl, sState) {
            var that = this;
            // eslint-disable-next-line no-undef
            return new Promise(function (resolve, reject) {
                var oPopup = window.open(sAuthUrl, "msLoginPopup", "width=500,height=650");
                if (!oPopup) {
                    reject(new Error("Sign-in popup was blocked by the browser."));
                    return;
                }

                var iInterval = window.setInterval(function () {
                    if (oPopup.closed) {
                        window.clearInterval(iInterval);
                        reject(new Error("Sign-in popup was closed before completing."));
                        return;
                    }

                    var sHref;
                    try {
                        sHref = oPopup.location.href;
                    } catch (oCrossOriginError) { // eslint-disable-line no-unused-vars
                        return; // still on login.microsoftonline.com
                    }

                    if (sHref.indexOf(that.OAUTH_REDIRECT_URI) !== 0) {
                        return;
                    }

                    window.clearInterval(iInterval);
                    oPopup.close();

                    var oParams = new URL(sHref).searchParams;
                    if (oParams.get("state") !== sState) {
                        reject(new Error("OAuth state mismatch."));
                        return;
                    }
                    if (oParams.get("error")) {
                        reject(new Error(oParams.get("error_description") || oParams.get("error")));
                        return;
                    }

                    resolve(oParams.get("code"));
                }, 150);
            });
        },

        /* eslint-disable @sap-ux/fiori-tools/sap-no-dom-insertion */
        _exchangeCodeForToken: function (sCode, sVerifier) {
            var oParams = new URLSearchParams();
            oParams.append("grant_type", "authorization_code");
            oParams.append("client_id", this.OAUTH_CLIENT_ID);
            oParams.append("redirect_uri", this.OAUTH_REDIRECT_URI);
            oParams.append("code", sCode);
            oParams.append("code_verifier", sVerifier);
            oParams.append("scope", "https://graph.microsoft.com/Notes.Read.All https://graph.microsoft.com/Files.Read.All");

            return fetch("https://login.microsoftonline.com/" + this.OAUTH_TENANT_ID + "/oauth2/v2.0/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: oParams
            })
            .then(function (oResponse) {
                if (!oResponse.ok) { throw new Error("Token exchange failed."); }
                return oResponse.json();
            })
            .then(function (oData) {
                return oData.access_token;
            });
        },
        /* eslint-enable @sap-ux/fiori-tools/sap-no-dom-insertion */

        /**
         * Cached for the lifetime of the page after the first successful sign-in, so
         * every delegated call (recent notebooks, page picker re-extraction, repeated
         * sign-in clicks) reuses the same token instead of prompting a login popup
         * every time.
         */
        _acquireGraphTokenManual: async function () {
            if (this._cachedDelegatedToken) {
                return this._cachedDelegatedToken;
            }

            var sVerifier = this._generateRandomString();
            var sChallenge = await this._generatePkceChallenge(sVerifier);
            var sState = this._generateRandomString();

            /* eslint-disable camelcase */
            var oAuthParams = new URLSearchParams({
                client_id: this.OAUTH_CLIENT_ID,
                response_type: "code",
                redirect_uri: this.OAUTH_REDIRECT_URI,
                response_mode: "query",
                scope: "https://graph.microsoft.com/Notes.Read.All https://graph.microsoft.com/Files.Read.All https://graph.microsoft.com/User.Read",
                state: sState,
                code_challenge: sChallenge,
                code_challenge_method: "S256"
            });
            /* eslint-enable camelcase */

            var sAuthUrl = "https://login.microsoftonline.com/" + this.OAUTH_TENANT_ID + "/oauth2/v2.0/authorize?" + oAuthParams.toString();
            var sCode = await this._openLoginPopupAndGetCode(sAuthUrl, sState);
            this._cachedDelegatedToken = await this._exchangeCodeForToken(sCode, sVerifier);
            return this._cachedDelegatedToken;
        },
        /* eslint-enable @sap-ux/fiori-tools/sap-no-hardcoded-url */

        /**
         * Builds a flat list of { type: "text"|"image", content, src } from a OneNote
         * page's HTML, used for the results table and the PDF export. OneNote's exported
         * markup doesn't reliably wrap text in <p> tags (can be bare text nodes, <div>s,
         * <span>s, etc. depending on how the page was authored), so rather than walking
         * specific tags looking for text, the whole body's textContent is taken as a
         * single block; images are then listed as their own items after it.
         *
         * Also returns "html": the same page markup with every fetched <img>'s src
         * rewritten in place from its (auth-only) Graph resource URL to the data URL just
         * downloaded, for in-app rendering via sap.ui.core.HTML - the browser can't fetch
         * graph.microsoft.com images itself (needs our bearer token), so the original
         * src="https://graph.microsoft.com/..." would otherwise 401/appear broken.
         *
         * fnFetchImageBlob(sGraphSrc) => Promise<Blob|null>; pass null to skip images
         * entirely (html is returned unmodified in that case).
         */
        _parseItemsFromHtml: async function (sHtml, fnFetchImageBlob) {
            var oDoc = new DOMParser().parseFromString(sHtml, "text/html");
            var aItems = [];

            var sText = oDoc.body.textContent.trim();
            if (sText) {
                aItems.push({ type: "text", content: sText, src: "" });
            }

            if (fnFetchImageBlob) {
                var aImageEls = Array.from(oDoc.body.querySelectorAll("img"));
                for (var i = 0; i < aImageEls.length; i++) {
                    var sSrc = aImageEls[i].getAttribute("src");
                    if (!sSrc || !sSrc.includes("graph.microsoft.com")) {
                        continue;
                    }

                    var oBlob = await fnFetchImageBlob(sSrc);
                    if (!oBlob) {
                        continue;
                    }

                    var sDataUrl = this._normalizeImageDataUrl(await this._blobToDataUrl(oBlob));
                    var oDims = await this._getImageDimensions(sDataUrl);
                    aItems.push({ type: "image", content: "", src: sDataUrl, width: oDims.width, height: oDims.height });
                    aImageEls[i].setAttribute("src", sDataUrl);
                }
            }

            return { items: aItems, html: oDoc.body.innerHTML };
        },

        /**
         * Builds the "Data Extractor" instruction prompt: the OneNote page's header
         * metadata is already known to the app (section/page/user identity, timestamp),
         * so it's handed to the model as given facts to echo back rather than asked for -
         * the model only needs to supply "data". _runDataExtraction overwrites "header"
         * (and recomputes "record_count") after parsing regardless, so this is
         * belt-and-suspenders against the model mangling the echoed values.
         * sSourceDescription describes whatever's attached after this prompt (a PDF, or
         * raw HTML + images) so the instructions still make sense regardless of transport.
         */
        /* eslint-disable camelcase */
        _buildDataExtractorPrompt: function (oHeaderContext, sSourceDescription) {
            return "You are a Data Extractor. Analyze " + sSourceDescription +
                " and generate a JSON payload.\n\n" +
                "Return a single JSON object with two sections: \"header\" and \"data\".\n\n" +
                "Use exactly this object, unmodified, as \"header\" (it is already known - do not change any values):\n" +
                JSON.stringify(oHeaderContext, null, 2) + "\n\n" +
                "Extract all product/label records found in the document and create one JSON " +
                "object per product in the \"data\" array. For each product extract:\n" +
                JSON.stringify({
                    weight: "<numeric value>",
                    weight_unit: "<lb, oz, kg, etc>",
                    material_name: "<product/material description>",
                    lot_number: "<lot number>",
                    item_number: "<item number>",
                    barcode_value: "<barcode or GS1 value>",
                    date: "<sell by, use by, freeze by, best before, packed date, whichever applies>",
                    material_reference: "<number shown next to the image or barcode block, e.g. 81269>",
                    sectionname: oHeaderContext.section,
                    pagename: oHeaderContext.page,
                    user_id: oHeaderContext.user_id,
                    timestamp: oHeaderContext.timestamp,
                    email: oHeaderContext.email,
                    sectionid: oHeaderContext.sectionid,
                    pageid: oHeaderContext.pageid,
                    user_display_name: oHeaderContext.user_display_name
                }, null, 2) + "\n\n" +
                "Extraction rules:\n" +
                "- Extract all records found in the document.\n" +
                "- Remove duplicate records caused by OCR duplication.\n" +
                "- Preserve barcode values exactly as shown.\n" +
                "- Normalize dates to MM/DD/YYYY when possible.\n" +
                "- Use null for missing values.\n" +
                "- Use the material number appearing beside each image/label as material_reference.\n" +
                "- Weight should contain only the numeric value.\n" +
                "- Weight unit should contain only the unit.\n" +
                "- Set \"record_count\" in the header to the number of records in \"data\".\n\n" +
                "Return only valid JSON, no markdown code fences, no commentary.";
        },
        /* eslint-enable camelcase */

        /**
         * Strips an optional ```/```json code fence and JSON.parses the model's response,
         * throwing a clear error if the result isn't the { header, data: [...] } shape the
         * Data Extractor prompt asked for.
         */
        _parseDataExtractorResponse: function (sText) {
            var sJson = (sText || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

            var oParsed;
            try {
                oParsed = JSON.parse(sJson);
            } catch (oError) {
                throw new Error("Model did not return valid JSON: " + oError.message);
            }

            if (!oParsed || !Array.isArray(oParsed.data)) {
                throw new Error("Model response is missing a \"data\" array.");
            }

            return oParsed;
        },

        /**
         * Sends a generated PDF (as a base64 data URL) to OpenRouter's chat completions
         * endpoint (Claude Opus 4.7) with the Data Extractor prompt and parses the
         * resulting { header, data } payload. Claude models handle PDF documents natively
         * via OpenRouter's "file" content block - no separate parsing plugin is needed.
         * Throws on failure; callers surface the error to the user rather than silently
         * swallowing it, since this is an explicit user action (button press).
         */
        /* eslint-disable camelcase */
        _extractDataFromPdfWithOpenRouter: async function (sPdfDataUrl, oHeaderContext) {
            if (!this.OPENROUTER_API_KEY) {
                throw new Error("OpenRouter API key not configured");
            }

            var sText = await this._callOpenRouter([
                { type: "text", text: this._buildDataExtractorPrompt(oHeaderContext, "the attached PDF (exported from a OneNote page)") },
                { type: "file", file: { filename: "onenote-export.pdf", file_data: sPdfDataUrl } }
            ]);
            return this._parseDataExtractorResponse(sText);
        },
        /* eslint-enable camelcase */

        /**
         * Sends the OneNote page's raw exported HTML plus its already-fetched images
         * (data URLs, same ones _parseItemsFromHtml downloaded for the results table/PDF)
         * to OpenRouter with the Data Extractor prompt. Unlike the PDF path, this skips
         * jsPDF's re-layout of the page entirely - the model sees the page's own markup
         * (which can preserve structure jsPDF's plain-text reflow loses) alongside its
         * images in document order. Images are attached separately as "image_url" blocks
         * since OneNote's <img> tags in the raw HTML point at Graph resource URLs
         * OpenRouter can't fetch on its own (they require our bearer token).
         */
        /* eslint-disable camelcase */
        _extractDataFromHtmlWithOpenRouter: async function (sHtml, aImageDataUrls, oHeaderContext) {
            if (!this.OPENROUTER_API_KEY) {
                throw new Error("OpenRouter API key not configured");
            }

            var aContentBlocks = [
                { type: "text", text: this._buildDataExtractorPrompt(oHeaderContext, "the raw OneNote page HTML below, followed by its images in document order") },
                { type: "text", text: sHtml }
            ];
            aImageDataUrls.forEach(function (sDataUrl) {
                aContentBlocks.push({ type: "image_url", image_url: { url: sDataUrl } });
            });

            var sText = await this._callOpenRouter(aContentBlocks);
            return this._parseDataExtractorResponse(sText);
        },
        /* eslint-enable camelcase */

        /**
         * Shared OpenRouter chat completions call - posts a single user message with the
         * given content blocks (text/image_url/file) to the configured model and returns
         * the trimmed text of the first choice. Used by both image and PDF analysis.
         */
        _callOpenRouter: async function (aContentBlocks) {
            var oResponse = await fetch(this.OPENROUTER_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + this.OPENROUTER_API_KEY,
                    // Required-ish by OpenRouter for attribution/rankings; harmless if ignored.
                    "X-Title": "ZoneNote"
                },
                body: JSON.stringify({
                    model: this.OPENROUTER_MODEL,
                    messages: [{ role: "user", content: aContentBlocks }]
                })
            });

            if (!oResponse.ok) {
                var oErrorBody = await oResponse.json().catch(function () { return null; });
                throw new Error((oErrorBody && oErrorBody.error && oErrorBody.error.message) || ("HTTP " + oResponse.status));
            }

            var oData = await oResponse.json();
            var oChoice = oData.choices && oData.choices[0];
            var vContent = oChoice && oChoice.message && oChoice.message.content;
            if (Array.isArray(vContent)) {
                vContent = vContent.map(function (oPart) { return oPart.text || ""; }).join("");
            }
            return vContent ? String(vContent).trim() : "";
        },

        _blobToDataUrl: function (oBlob) {
            // eslint-disable-next-line no-undef
            return new Promise(function (resolve, reject) {
                var oReader = new FileReader();
                oReader.onload = function () { resolve(oReader.result); };
                oReader.onerror = function () { reject(oReader.error); };
                oReader.readAsDataURL(oBlob);
            });
        },

        /**
         * Fetches the signed-in Microsoft 365 user's profile (id/email/display name) for
         * the Data Extractor header - requires the "User.Read" scope requested alongside
         * Notes.Read.All/Files.Read.All in _acquireGraphTokenManual. Cached on the
         * controller instance since it can't change within a session.
         */
        _fetchSignedInUserProfile: async function (sToken) {
            if (this._cachedUserProfile) {
                return this._cachedUserProfile;
            }

            // eslint-disable-next-line @sap-ux/fiori-tools/sap-no-hardcoded-url
            var oResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
                headers: { "Authorization": "Bearer " + sToken }
            });
            if (!oResponse.ok) {
                throw new Error("Failed to fetch signed-in user profile from Microsoft Graph (" + oResponse.status + ").");
            }

            var oData = await oResponse.json();
            this._cachedUserProfile = {
                id: oData.id || null,
                email: oData.mail || oData.userPrincipalName || null,
                displayName: oData.displayName || null
            };
            return this._cachedUserProfile;
        },

        /**
         * Microsoft Graph serves OneNote image resources with an unhelpful
         * "Content-Type: application/octet-stream", which FileReader.readAsDataURL
         * carries straight into the data URL (data:application/octet-stream;base64,...).
         * jsPDF/img-tag rendering don't care, but OpenRouter/Anthropic's vision API
         * validates media_type strictly against image/jpeg|png|gif|webp and 400s on
         * anything else. Sniff the real format from the file's magic bytes and rewrite
         * the data URL's mime type accordingly. Returns the input unchanged if the
         * format can't be identified.
         */
        _normalizeImageDataUrl: function (sDataUrl) {
            var iCommaIdx = sDataUrl.indexOf(",");
            if (iCommaIdx === -1) {
                return sDataUrl;
            }

            var sBase64 = sDataUrl.substring(iCommaIdx + 1);
            var sBytes;
            try {
                sBytes = atob(sBase64.substring(0, 16));
            } catch (oError) { // eslint-disable-line no-unused-vars
                return sDataUrl;
            }

            var sMimeType;
            if (sBytes.charCodeAt(0) === 0x89 && sBytes.substring(1, 4) === "PNG") {
                sMimeType = "image/png";
            } else if (sBytes.charCodeAt(0) === 0xFF && sBytes.charCodeAt(1) === 0xD8 && sBytes.charCodeAt(2) === 0xFF) {
                sMimeType = "image/jpeg";
            } else if (sBytes.substring(0, 3) === "GIF") {
                sMimeType = "image/gif";
            } else if (sBytes.substring(0, 4) === "RIFF" && sBytes.substring(8, 12) === "WEBP") {
                sMimeType = "image/webp";
            } else {
                return sDataUrl;
            }

            return "data:" + sMimeType + ";base64," + sBase64;
        },

        _getImageDimensions: function (sDataUrl) {
            // eslint-disable-next-line no-undef
            return new Promise(function (resolve) {
                var oImg = new Image();
                oImg.onload = function () { resolve({ width: oImg.naturalWidth, height: oImg.naturalHeight }); };
                oImg.onerror = function () { resolve({ width: 0, height: 0 }); };
                oImg.src = sDataUrl;
            });
        },

        _getImageFormat: function (sDataUrl) {
            var oMatch = /^data:image\/(png|jpeg|jpg|webp)/i.exec(sDataUrl);
            return oMatch ? oMatch[1].toUpperCase().replace("JPG", "JPEG") : "PNG";
        },

        /**
         * Bound to the "My Notes" tab's "Download as PDF" button - unchanged behavior,
         * just delegates the actual rendering to the shared _exportItemsToPdf.
         */
        onDownloadPdfPress: function () {
            var aItems = this.getView().getModel("onenote").getProperty("/selectedPageItems") || [];
            this._exportItemsToPdf(aItems);
        },

        /**
         * Same as onDownloadPdfPress, but for the separate "Extract from URL" tab.
         */
        onDownloadUrlPdfPress: function () {
            var aItems = this.getView().getModel("onenote").getProperty("/urlSelectedPageItems") || [];
            this._exportItemsToPdf(aItems);
        },

        /**
         * Bound to the "My Notes" tab's "Analyze PDF" button - builds the same PDF as
         * onDownloadPdfPress (without downloading it) and sends it to OpenRouter's Data
         * Extractor, shown under the button as a grid via the "/pdfExtraction" model
         * property.
         */
        onAnalyzePdfPress: async function () {
            var aItems = this.getView().getModel("onenote").getProperty("/selectedPageItems") || [];
            await this._extractDataFromItemsAsPdf(aItems, "/pages", "/selectedPageId", "/pdfExtraction", "/pdfExtractionError");
        },

        /**
         * Same as onAnalyzePdfPress, but for the separate "Extract from URL" tab.
         */
        onAnalyzeUrlPdfPress: async function () {
            var aItems = this.getView().getModel("onenote").getProperty("/urlSelectedPageItems") || [];
            await this._extractDataFromItemsAsPdf(aItems, "/urlPages", "/urlSelectedPageId", "/urlPdfExtraction", "/urlPdfExtractionError");
        },

        /**
         * Bound to the "My Notes" tab's "Analyze Note" button - sends the page's raw
         * exported HTML (plus its already-fetched images) straight to OpenRouter's Data
         * Extractor instead of building a PDF first. Writes to the same "/pdfExtraction"
         * property as onAnalyzePdfPress, so either button fills the same grid.
         */
        onAnalyzeNotePress: async function () {
            var oModel = this.getView().getModel("onenote");
            var aItems = oModel.getProperty("/selectedPageItems") || [];
            var sHtml = oModel.getProperty("/selectedPageHtml") || "";
            await this._extractDataFromNoteHtml(sHtml, aItems, "/pages", "/selectedPageId", "/pdfExtraction", "/pdfExtractionError");
        },

        /**
         * Same as onAnalyzeNotePress, but for the separate "Extract from URL" tab.
         */
        onAnalyzeUrlNotePress: async function () {
            var oModel = this.getView().getModel("onenote");
            var aItems = oModel.getProperty("/urlSelectedPageItems") || [];
            var sHtml = oModel.getProperty("/urlSelectedPageHtml") || "";
            await this._extractDataFromNoteHtml(sHtml, aItems, "/urlPages", "/urlSelectedPageId", "/urlPdfExtraction", "/urlPdfExtractionError");
        },

        /**
         * Assembles the Data Extractor's "header" section from data the app already has -
         * the selected page's own metadata (looked up by id in the given pages list) plus
         * the signed-in user's Graph profile - since none of that is present in the PDF/
         * HTML content itself for the model to read.
         */
        /* eslint-disable camelcase */
        _buildExtractionHeaderContext: async function (sPagesPath, sSelectedPageIdPath) {
            var oModel = this.getView().getModel("onenote");
            var aPages = oModel.getProperty(sPagesPath) || [];
            var sPageId = oModel.getProperty(sSelectedPageIdPath);
            var oPage = aPages.find(function (p) { return p.id === sPageId; }) || {};

            var sToken = await this._acquireGraphTokenManual();
            var oUser = await this._fetchSignedInUserProfile(sToken);

            return {
                section_name: oPage._sectionName || null,
                section_id: oPage._sectionId || null,
                page_name: oPage.title || null,
                page_id: oPage.id || null,
                user_id: oUser.id || null,
                user_email: oUser.email || null,
                user_display_name: oUser.displayName || null,
                generated_timestamp: new Date().toISOString(),
                source_type: "OneNote"
            };
        },
        /* eslint-enable camelcase */

        /**
         * Shared plumbing for both the PDF-based and HTML-based Data Extractor runs:
         * builds the header context, delegates to fnExtract(oHeaderContext) to do the
         * actual OpenRouter call for whichever transport is in use, then overwrites
         * "header" with the authoritative context (identity/section/page/timestamp aren't
         * in the PDF/HTML for the model to know) and recomputes "record_count" from the
         * real data array length. Result (or error) is written to the given model
         * properties so the view can render the grid; oView.setBusy wraps the whole call.
         */
        _runDataExtraction: async function (sPagesPath, sSelectedPageIdPath, sResultPath, sErrorPath, fnExtract) {
            var oView = this.getView();
            var oModel = oView.getModel("onenote");

            oModel.setProperty(sErrorPath, "");
            oModel.setProperty(sResultPath, null);
            oView.setBusy(true);
            try {
                var oHeaderContext = await this._buildExtractionHeaderContext(sPagesPath, sSelectedPageIdPath);
                var oResult = await fnExtract(oHeaderContext);
                // eslint-disable-next-line camelcase
                oResult.header = Object.assign({}, oHeaderContext, { record_count: oResult.data.length });
                oModel.setProperty(sResultPath, oResult);
            } catch (oError) {
                Log.error("OpenRouter data extraction failed: " + oError.message);
                oModel.setProperty(sErrorPath, "Extraction failed: " + oError.message);
            } finally {
                oView.setBusy(false);
            }
        },

        /**
         * Builds the given items into a PDF (via _buildPdfDocument, same rendering as
         * _exportItemsToPdf), converts it to a base64 data URL, and runs it through
         * _runDataExtraction / _extractDataFromPdfWithOpenRouter.
         */
        _extractDataFromItemsAsPdf: async function (aItems, sPagesPath, sSelectedPageIdPath, sResultPath, sErrorPath) {
            if (aItems.length === 0) {
                MessageBox.warning("Nothing to analyze yet - extract a page first.");
                return;
            }

            await this._runDataExtraction(sPagesPath, sSelectedPageIdPath, sResultPath, sErrorPath, async function (oHeaderContext) {
                var oDoc = this._buildPdfDocument(aItems);
                // jsPDF's "datauristring" output embeds a non-standard "filename=" segment
                // (data:application/pdf;filename=...;base64,...) that OpenRouter/Anthropic's
                // data-URL parser rejects. Going through a Blob + FileReader instead yields
                // a clean "data:application/pdf;base64,..." string.
                var sPdfDataUrl = await this._blobToDataUrl(oDoc.output("blob"));
                return this._extractDataFromPdfWithOpenRouter(sPdfDataUrl, oHeaderContext);
            }.bind(this));
        },

        /**
         * Runs the page's raw HTML (plus its already-fetched image data URLs) through
         * _runDataExtraction / _extractDataFromHtmlWithOpenRouter - no PDF is built.
         */
        _extractDataFromNoteHtml: async function (sHtml, aItems, sPagesPath, sSelectedPageIdPath, sResultPath, sErrorPath) {
            if (!sHtml) {
                MessageBox.warning("Nothing to analyze yet - extract a page first.");
                return;
            }

            var aImageDataUrls = aItems
                .filter(function (oItem) { return oItem.type === "image"; })
                .map(function (oItem) { return oItem.src; });

            await this._runDataExtraction(sPagesPath, sSelectedPageIdPath, sResultPath, sErrorPath, function (oHeaderContext) {
                return this._extractDataFromHtmlWithOpenRouter(sHtml, aImageDataUrls, oHeaderContext);
            }.bind(this));
        },

        /**
         * Renders the given items (text + images, in document order) as a PDF using
         * jsPDF and triggers a browser download. Client-side only, no backend.
         */
        _exportItemsToPdf: function (aItems) {
            if (aItems.length === 0) {
                MessageBox.warning("Nothing to export yet - extract a page first.");
                return;
            }

            var oDoc = this._buildPdfDocument(aItems);
            oDoc.save("onenote-export.pdf");
        },

        /**
         * Shared PDF rendering used by both _exportItemsToPdf (download) and
         * _extractDataFromItemsAsPdf (send to OpenRouter) - builds and returns the jsPDF
         * document without saving/downloading it.
         */
        _buildPdfDocument: function (aItems) {
            // eslint-disable-next-line new-cap
            var oDoc = new window.jspdf.jsPDF();
            var iMargin = 15;
            var iMaxWidth = oDoc.internal.pageSize.getWidth() - iMargin * 2;
            var iMaxHeight = oDoc.internal.pageSize.getHeight() - iMargin * 2;
            var iPageBottom = oDoc.internal.pageSize.getHeight() - iMargin;
            var iY = iMargin;

            aItems.forEach(function (oItem) {
                if (oItem.type === "text") {
                    var aLines = oDoc.splitTextToSize(oItem.content, iMaxWidth);
                    aLines.forEach(function (sLine) {
                        if (iY > iPageBottom) {
                            oDoc.addPage();
                            iY = iMargin;
                        }
                        oDoc.text(sLine, iMargin, iY);
                        iY += 7;
                    });
                    iY += 3;
                } else if (oItem.type === "image") {
                    var iImgWidth = iMaxWidth;
                    var iImgHeight = oItem.width && oItem.height ? iImgWidth * (oItem.height / oItem.width) : 60;
                    if (iImgHeight > iMaxHeight) {
                        iImgHeight = iMaxHeight;
                        iImgWidth = oItem.width && oItem.height ? iImgHeight * (oItem.width / oItem.height) : iMaxWidth;
                    }

                    if (iY + iImgHeight > iPageBottom) {
                        oDoc.addPage();
                        iY = iMargin;
                    }

                    try {
                        oDoc.addImage(oItem.src, this._getImageFormat(oItem.src), iMargin, iY, iImgWidth, iImgHeight, undefined, "FAST");
                    } catch (oImgError) {
                        Log.error("Skipping image in PDF export: " + oImgError.message);
                    }
                    iY += iImgHeight + 5;
                }
            }, this);

            return oDoc;
        },
    _debugListAllVisibleNotebooks: async function (sToken, sOwnerUserId) {
        var aPathSegments = ["me"];
        if (sOwnerUserId) { aPathSegments.push("users/" + sOwnerUserId); }

        for (var i = 0; i < aPathSegments.length; i++) {
            try {
                var aNotebooks = await this._fetchAllGraphPages(
                    this._onenoteBase(aPathSegments[i]) + "/notebooks?$top=100", sToken);
                Log.info("Notebooks visible under /" + aPathSegments[i] + "/: " +
                    aNotebooks.map(function (n) { return n.displayName + " (" + n.id + ")"; }).join(" | "));
            } catch (oError) {
                Log.error("Listing failed under /" + aPathSegments[i] + "/: " + oError.message);
            }
        }
    },
    /**
 * Prefer the driveItem's own createdBy email over the regex-guessed userId from the
 * URL - SharePoint path segments replace BOTH "." and "@"/domain separators with "_",
 * so a name containing a dot (e.g. "Ismael.Rodriguez") is not reliably reversible from
 * the URL alone (see 30108 "OneDrive for Business... cannot be retrieved" when the
 * guessed address doesn't exist). createdBy.user.email is Graph's own authoritative
 * value for who owns the item.
 */
_resolveOwnerEmail: function (oDriveItem, oParsed) {
    var sFromDriveItem = oDriveItem && oDriveItem.createdBy && oDriveItem.createdBy.user
        && oDriveItem.createdBy.user.email;
    return sFromDriveItem || (oParsed && oParsed.userId) || "";
},
    onDebugListNotebooksPress: async function () {
   var sToken = await this._acquireGraphTokenManual();
    await this._debugListAllVisibleNotebooks(sToken, "Ismael.Rodriguez@porky.com"); // from createdBy, not URL parse
},



/**
 * Parses a OneNote page's exported HTML preserving each element's absolute position,
 * instead of flattening to sequential text (see _parseItemsFromHtml, which loses
 * layout). OneNote's HTML export places every top-level block in a
 * style="position:absolute;left:Npx;top:Npx" (sometimes inches: "1.0in") div - this
 * walks those blocks and returns them with position data intact, plus the overall
 * page bounds (from body's declared size, or computed from the furthest-right/bottom
 * block if not declared).
 */
_parsePositionedItemsFromHtml: async function (sHtml, fnFetchImageBlob) {
    var oDoc = new DOMParser().parseFromString(sHtml, "text/html");
    var aBlocks = Array.from(oDoc.body.children).filter(function (el) {
        return el.tagName === "DIV" && /position:\s*absolute/i.test(el.getAttribute("style") || "");
    });

    var oImages = await this._extractPositionedImages(oDoc, aBlocks, fnFetchImageBlob);
    var oText = this._extractPositionedText(aBlocks);

    var iMaxRight = Math.max(oImages.maxRight, oText.maxRight);
    var iMaxBottom = Math.max(oImages.maxBottom, oText.maxBottom);

    // OneNote pages don't declare a fixed canvas size in the HTML - fall back to
    // US Letter proportions (in px @96dpi) if nothing was measured, otherwise pad
    // the furthest content bounds so nothing sits flush against the edge.
    return {
        items: oImages.items.concat(oText.items),
        pageWidth: Math.max(iMaxRight + 60, 816),
        pageHeight: Math.max(iMaxBottom + 60, 1056)
    };
},

_parseLengthToPx: function (sValue) {
    if (!sValue) { return 0; }
    var oMatch = /(-?[\d.]+)(px|in|pt|cm)?/.exec(sValue);
    if (!oMatch) { return 0; }
    var fNum = parseFloat(oMatch[1]);
    var sUnit = oMatch[2] || "px";
    // Normalize everything to px at 96dpi, since canvas works in px and OneNote's
    // export commonly uses "in" for its absolute-positioned blocks.
    switch (sUnit) {
        case "in": return fNum * 96;
        case "pt": return fNum * 96 / 72;
        case "cm": return fNum * 96 / 2.54;
        default: return fNum; // px
    }
},

_getBlockOrigin: function (oBlock) {
    var sStyle = oBlock.getAttribute("style") || "";
    var oLeftMatch = /left:\s*([^;]+)/i.exec(sStyle);
    var oTopMatch = /top:\s*([^;]+)/i.exec(sStyle);
    var oWidthMatch = /width:\s*([^;]+)/i.exec(sStyle);
    return {
        left: this._parseLengthToPx(oLeftMatch && oLeftMatch[1]),
        top: this._parseLengthToPx(oTopMatch && oTopMatch[1]),
        width: oWidthMatch ? this._parseLengthToPx(oWidthMatch[1]) : 400
    };
},

/**
 * Walks up from oEl looking for the nearest ancestor with an inline
 * position:absolute style, tolerant of whitespace/case variants (e.g.
 * "position: absolute", "POSITION:ABSOLUTE"). A plain CSS attribute selector
 * (closest('[style*="position:absolute"]')) missed a meaningful number of real
 * cases in practice - this regex walk is the more forgiving equivalent.
 */
_findPositionedAncestor: function (oEl, oBody) {
    var oCurrent = oEl.parentElement;
    while (oCurrent && oCurrent !== oBody) {
        if (/position\s*:\s*absolute/i.test(oCurrent.getAttribute("style") || "")) {
            return oCurrent;
        }
        oCurrent = oCurrent.parentElement;
    }
    return null;
},

/**
 * A block can contain more than one <img> (OneNote frequently groups several
 * pasted photos into a single positioned container), so every <img> in the whole
 * page is walked individually here rather than taking just the first match per
 * block - that was silently dropping every image after the first one in a
 * multi-image block. Images sharing a block are stacked vertically from that
 * block's origin, since only the block itself carries absolute position data,
 * not each image within it. Images whose positioned ancestor can't be
 * identified at all are NOT dropped either - they're stacked below whatever's
 * been placed so far instead, since showing an image in an approximate spot is
 * always better than silently losing it.
 */
_extractPositionedImages: async function (oDoc, aBlocks, fnFetchImageBlob) {
    var aItems = [];
    var iMaxRight = 0;
    var iMaxBottom = 0;
    var oBlockStackOffset = {};

    var aImageEls = Array.from(oDoc.body.querySelectorAll("img"));
    for (var k = 0; k < aImageEls.length; k++) {
        var oImgEl = aImageEls[k];
        var sSrc = oImgEl.getAttribute("src");
        if (!sSrc || !sSrc.includes("graph.microsoft.com") || !fnFetchImageBlob) {
            continue;
        }

        var oBlob = await fnFetchImageBlob(sSrc);
        if (!oBlob) {
            continue;
        }

        var sDataUrl = this._normalizeImageDataUrl(await this._blobToDataUrl(oBlob));
        var oDims = await this._getImageDimensions(sDataUrl);

        var oOwnerBlock = this._findPositionedAncestor(oImgEl, oDoc.body);
        var oBlock = oOwnerBlock ? this._getBlockOrigin(oOwnerBlock) : null;
        var iImgWidth = oImgEl.getAttribute("width") ? parseFloat(oImgEl.getAttribute("width"))
            : (oDims.width || (oBlock ? oBlock.width : 400));
        var iImgHeight = oImgEl.getAttribute("height") ? parseFloat(oImgEl.getAttribute("height"))
            : (oDims.width ? iImgWidth * (oDims.height / oDims.width) : 200);

        var iLeft, iTop;
        if (oBlock) {
            var sBlockKey = "b" + aBlocks.indexOf(oOwnerBlock);
            var iStackOffset = oBlockStackOffset[sBlockKey] || 0;
            iLeft = oBlock.left;
            iTop = oBlock.top + iStackOffset;
            oBlockStackOffset[sBlockKey] = iStackOffset + iImgHeight + 10;
        } else {
            iLeft = 20;
            iTop = iMaxBottom + 20;
        }

        aItems.push({ type: "image", left: iLeft, top: iTop, width: iImgWidth, height: iImgHeight, src: sDataUrl });
        iMaxRight = Math.max(iMaxRight, iLeft + iImgWidth);
        iMaxBottom = Math.max(iMaxBottom, iTop + iImgHeight);
    }

    return { items: aItems, maxRight: iMaxRight, maxBottom: iMaxBottom };
},

/**
 * Top-level positioned blocks that don't themselves contain an image (image-
 * bearing blocks are handled by _extractPositionedImages instead).
 */
_extractPositionedText: function (aBlocks) {
    var aItems = [];
    var iMaxRight = 0;
    var iMaxBottom = 0;

    for (var i = 0; i < aBlocks.length; i++) {
        var oTextBlock = aBlocks[i];
        if (oTextBlock.querySelector("img")) {
            continue;
        }

        var sText = oTextBlock.textContent.trim();
        if (!sText) { continue; }

        var oOrigin = this._getBlockOrigin(oTextBlock);
        // eslint-disable-next-line @sap-ux/fiori-tools/sap-no-inner-html-access
        var oFontMatch = /font-size:\s*([\d.]+)pt/i.exec(oTextBlock.innerHTML || "");
        var iFontSize = oFontMatch ? Math.round(parseFloat(oFontMatch[1]) * 96 / 72) : 16;

        aItems.push({ type: "text", left: oOrigin.left, top: oOrigin.top, width: oOrigin.width, fontSize: iFontSize, content: sText });
        iMaxRight = Math.max(iMaxRight, oOrigin.left + oOrigin.width);
        iMaxBottom = Math.max(iMaxBottom, oOrigin.top + iFontSize * 4); // rough estimate; refined during render measurement
    }

    return { items: aItems, maxRight: iMaxRight, maxBottom: iMaxBottom };
},

/**
 * Rasterizes a positioned page layout (from _parsePositionedItemsFromHtml) onto a
 * canvas at exact coordinates, then returns it as a full-page PNG data URL. This is
 * what makes the export "original format": text sits where it actually sat on the
 * page, and images/ink (already rasterized by OneNote's own export) sit at their
 * real position too, rather than being reflowed top-to-bottom.
 */
_renderPositionedLayoutToImage: async function (oLayout) {
    // eslint-disable-next-line @sap-ux/fiori-tools/sap-no-element-creation
    var oCanvas = document.createElement("canvas");
    oCanvas.width = oLayout.pageWidth;
    oCanvas.height = oLayout.pageHeight;
    var oCtx = oCanvas.getContext("2d");
    oCtx.fillStyle = "#ffffff";
    oCtx.fillRect(0, 0, oCanvas.width, oCanvas.height);
    oCtx.fillStyle = "#000000";
    oCtx.textBaseline = "top";

    for (var i = 0; i < oLayout.items.length; i++) {
        var oItem = oLayout.items[i];

        if (oItem.type === "image") {
            // eslint-disable-next-line no-undef
            await new Promise(function (resolve) {
                var oImg = new Image();
                oImg.onload = function () {
                    oCtx.drawImage(oImg, oItem.left, oItem.top, oItem.width, oItem.height);
                    resolve();
                };
                oImg.onerror = function () { resolve(); };
                oImg.src = oItem.src;
            });

        } else if (oItem.type === "text") {
            oCtx.font = oItem.fontSize + "px Calibri, Arial";
            var aWords = oItem.content.split(/\s+/);
            var sLine = "";
            var iLineY = oItem.top;
            var iLineHeight = oItem.fontSize * 1.3;

            aWords.forEach(function (sWord) {
                var sTest = sLine ? sLine + " " + sWord : sWord;
                if (oCtx.measureText(sTest).width > oItem.width && sLine) {
                    oCtx.fillText(sLine, oItem.left, iLineY);
                    iLineY += iLineHeight;
                    sLine = sWord;
                } else {
                    sLine = sTest;
                }
            });
            if (sLine) { oCtx.fillText(sLine, oItem.left, iLineY); }
        }
    }

    return { dataUrl: oCanvas.toDataURL("image/png"), width: oCanvas.width, height: oCanvas.height };
},

/**
 * Full pipeline: fetches a page's HTML, parses it with positions preserved, rasterizes
 * it to a single full-page image, and embeds that as one page in a PDF sized to match
 * the layout's aspect ratio (rather than forcing it into a fixed Letter/A4 page like
 * _exportItemsToPdf does) - this is the "original format" export.
 */
_exportPageOriginalFormatAsPdf: async function (sToken, sPathSegment, sPageId) {
    var oContentResponse = await fetch(
        this._onenoteBase(sPathSegment) + "/pages/" + sPageId + "/content?page_level_html=true",
        { headers: { "Authorization": "Bearer " + sToken } });
    if (!oContentResponse.ok) { throw new Error("Failed to fetch page content (" + oContentResponse.status + ")."); }
    var sHtml = await oContentResponse.text();

    var oLayout = await this._parsePositionedItemsFromHtml(sHtml, function (sSrc) {
        return fetch(sSrc, { headers: { "Authorization": "Bearer " + sToken } })
            .then(function (oImgResponse) { return oImgResponse.ok ? oImgResponse.blob() : null; });
    });

    if (oLayout.items.length === 0) {
        throw new Error("No positioned content found on this page.");
    }

    var oRendered = await this._renderPositionedLayoutToImage(oLayout);

    // eslint-disable-next-line new-cap
    var oDoc = new window.jspdf.jsPDF({
        orientation: oRendered.width >= oRendered.height ? "landscape" : "portrait",
        unit: "px",
        format: [oRendered.width, oRendered.height]
    });
    oDoc.addImage(oRendered.dataUrl, "PNG", 0, 0, oRendered.width, oRendered.height);
    oDoc.save("onenote-page-original.pdf");
},

/**
 * Bound to the "Extract from URL" tab's "Download Original Format" button. Reuses
 * whichever page id/pathSegment is currently selected in that tab's picker.
 */
onDownloadUrlOriginalPdfPress: async function () {
    var sPageId = this.getView().getModel("onenote").getProperty("/urlSelectedPageId");
    if (!this._urlPathSegment) { return MessageBox.warning("Extract a page first."); }
    return this._downloadOriginalFormatPdf(sPageId, this._urlPathSegment);
},

/**
 * Same as onDownloadUrlOriginalPdfPress, but for the "My Notes" tab - that tab always
 * operates under "me" (see onExtractViaLoginPress), so there's no equivalent
 * pathSegment tracking needed.
 */
onDownloadOriginalPdfPress: async function () {
    var sPageId = this.getView().getModel("onenote").getProperty("/selectedPageId");
    return this._downloadOriginalFormatPdf(sPageId, "me");
},

_downloadOriginalFormatPdf: async function (sPageId, sPathSegment) {
    if (!sPageId) {
        MessageBox.warning("No page selected.");
        return;
    }

    var oView = this.getView();
    oView.setBusy(true);
    try {
        await this._exportPageOriginalFormatAsPdf(this._cachedDelegatedToken, sPathSegment, sPageId);
    } catch (oError) {
        Log.error(oError);
        MessageBox.error("Original-format export failed: " + oError.message);
    } finally {
        oView.setBusy(false);
    }
}
    });
});

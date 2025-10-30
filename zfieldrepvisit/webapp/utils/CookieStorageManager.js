sap.ui.define([
  "sap/ui/base/Object"
], function (BaseObject) {
  "use strict";

  return BaseObject.extend("customer.porky.zfieldrepvisit.util.CookieStorageManager", {
    
    /**
     * Cookie configuration
     */
    _config: {
      prefix: "visit_",
      expiryDays: 7,
      maxCookieSize: 4000 // Conservative limit (browsers support ~4KB)
    },

    /**
     * Set a cookie with the given name and value
     * @param {string} name - Cookie name
     * @param {*} value - Cookie value (will be JSON stringified)
     * @param {number} days - Expiry in days (optional)
     */
    setCookie: function(name, value, days) {
      try {
        const expires = days || this._config.expiryDays;
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
        
        const jsonValue = JSON.stringify(value);
        const cookieName = this._config.prefix + name;
        
        // Check size limit
        if (jsonValue.length > this._config.maxCookieSize) {
          console.warn("Cookie size exceeds recommended limit:", jsonValue.length);
          // Split into chunks if needed
          return this._setLargeCookie(cookieName, jsonValue, date);
        }
        
        document.cookie = cookieName + "=" + encodeURIComponent(jsonValue) + 
                         ";expires=" + date.toUTCString() + ";path=/;SameSite=Strict";
        return true;
      } catch (error) {
        console.error("Error setting cookie:", error);
        return false;
      }
    },

    /**
     * Handle large cookies by splitting into chunks
     */
    _setLargeCookie: function(name, value, expiryDate) {
      const chunkSize = 3500; // Safe chunk size
      const chunks = Math.ceil(value.length / chunkSize);
      
      for (let i = 0; i < chunks; i++) {
        const chunk = value.substr(i * chunkSize, chunkSize);
        const chunkName = name + "_chunk_" + i;
        document.cookie = chunkName + "=" + encodeURIComponent(chunk) + 
                         ";expires=" + expiryDate.toUTCString() + ";path=/;SameSite=Strict";
      }
      
      // Store chunk count
      document.cookie = name + "_chunks=" + chunks + 
                       ";expires=" + expiryDate.toUTCString() + ";path=/;SameSite=Strict";
      return true;
    },

    /**
     * Get a cookie value by name
     * @param {string} name - Cookie name
     * @returns {*} Parsed cookie value or null
     */
    getCookie: function(name) {
      try {
        const cookieName = this._config.prefix + name;
        const nameEQ = cookieName + "=";
        const ca = document.cookie.split(';');
        
        // Check if it's chunked
        const chunkCountCookie = cookieName + "_chunks=";
        let chunkCount = 0;
        
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i].trim();
          if (c.indexOf(chunkCountCookie) === 0) {
            chunkCount = parseInt(c.substring(chunkCountCookie.length), 10);
            break;
          }
        }
        
        if (chunkCount > 0) {
          return this._getLargeCookie(cookieName, chunkCount);
        }
        
        // Regular cookie retrieval
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i].trim();
          if (c.indexOf(nameEQ) === 0) {
            const value = decodeURIComponent(c.substring(nameEQ.length));
            return JSON.parse(value);
          }
        }
        return null;
      } catch (error) {
        console.error("Error getting cookie:", error);
        return null;
      }
    },

    /**
     * Retrieve large cookie from chunks
     */
    _getLargeCookie: function(name, chunkCount) {
      let fullValue = "";
      
      for (let i = 0; i < chunkCount; i++) {
        const chunkName = name + "_chunk_" + i + "=";
        const ca = document.cookie.split(';');
        
        for (let j = 0; j < ca.length; j++) {
          let c = ca[j].trim();
          if (c.indexOf(chunkName) === 0) {
            fullValue += decodeURIComponent(c.substring(chunkName.length));
            break;
          }
        }
      }
      
      return fullValue ? JSON.parse(fullValue) : null;
    },

    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     */
    deleteCookie: function(name) {
      const cookieName = this._config.prefix + name;
      
      // Check if chunked
      const chunkCountCookie = this.getCookie(name + "_chunks");
      if (chunkCountCookie) {
        for (let i = 0; i < chunkCountCookie; i++) {
          document.cookie = cookieName + "_chunk_" + i + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
        }
        document.cookie = cookieName + "_chunks=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      }
      
      document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    },

    /**
     * Save visit data to cookie
     * @param {string} visitId - Visit identifier
     * @param {object} visitData - Visit data to store
     */
    saveVisitData: function(visitId, visitData) {
      const dataToStore = {
        visitId: visitId,
        data: visitData,
        timestamp: new Date().getTime(),
        synced: false
      };
      
      return this.setCookie("visit_" + visitId, dataToStore);
    },

    /**
     * Get visit data from cookie
     * @param {string} visitId - Visit identifier
     */
    getVisitData: function(visitId) {
      return this.getCookie("visit_" + visitId);
    },

    /**
     * Get all pending visits (unsynced)
     */
    getAllPendingVisits: function() {
      const cookies = document.cookie.split(';');
      const prefix = this._config.prefix + "visit_";
      const pendingVisits = [];
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(prefix) === 0 && !cookie.includes("_chunk_") && !cookie.includes("_chunks")) {
          const cookieName = cookie.split('=')[0];
          const visitId = cookieName.replace(prefix, "");
          const visitData = this.getVisitData(visitId);
          
          if (visitData && !visitData.synced) {
            pendingVisits.push(visitData);
          }
        }
      }
      
      return pendingVisits;
    },

    /**
     * Mark visit as synced
     * @param {string} visitId - Visit identifier
     */
    markAsSynced: function(visitId) {
      const visitData = this.getVisitData(visitId);
      if (visitData) {
        visitData.synced = true;
        visitData.syncedTimestamp = new Date().getTime();
        this.setCookie("visit_" + visitId, visitData);
      }
    },

    /**
     * Clear all visit cookies
     */
    clearAllVisits: function() {
      const cookies = document.cookie.split(';');
      const prefix = this._config.prefix;
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(prefix) === 0) {
          const cookieName = cookie.split('=')[0].replace(prefix, "");
          this.deleteCookie(cookieName);
        }
      }
    },

    /**
     * Clean up old synced visits
     * @param {number} daysOld - Remove synced visits older than this many days
     */
    cleanupOldVisits: function(daysOld) {
      daysOld = daysOld || 1;
      const cutoffTime = new Date().getTime() - (daysOld * 24 * 60 * 60 * 1000);
      const pendingVisits = this.getAllPendingVisits();
      
      pendingVisits.forEach(function(visit) {
        if (visit.synced && visit.syncedTimestamp < cutoffTime) {
          this.deleteCookie("visit_" + visit.visitId);
        }
      }.bind(this));
    }
  });
});
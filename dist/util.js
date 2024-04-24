"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInjection = exports.checkInjectionInt = void 0;
function checkInjectionInt(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id.includes("DROP") || id.includes("DELETE") || id.includes("SELECT") || id.includes("UPDATE") || id.includes("INSERT")
            || id.includes("CREATE") || id.includes("ALTER") || id.includes("TRUNCATE") || id.includes("DROP") || id.includes("UNION")
            || id.includes("JOIN") || id.includes("FROM") || id.includes("WHERE") || id.includes("HAVING") || id.includes("GROUP BY")
            || id.includes("ORDER BY") || id.includes("LIMIT") || id.includes("OFFSET") || id.includes("FETCH") || id.includes("EXISTS")
            || id.includes("LIKE") || id.includes("IN")) {
            return Promise.reject("Injection detected");
        }
        else if (parseInt(id, 10).toString() !== id) {
            return Promise.reject("Not a number");
        }
        else {
            return Promise.resolve();
        }
    });
}
exports.checkInjectionInt = checkInjectionInt;
function checkInjection(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const keywords = ["DROP", "DELETE", "SELECT", "UPDATE", "INSERT", "CREATE", "ALTER", "TRUNCATE", "UNION",
            "JOIN", "FROM", "WHERE", "HAVING", "GROUP BY", "ORDER BY", "LIMIT", "OFFSET",
            "FETCH", "EXISTS", "LIKE", "IN"];
        // Check for injection keywords
        if (keywords.some(keyword => name.toUpperCase().includes(keyword))) {
            return Promise.reject("Injection detected");
        }
        // Check if the name contains only digits
        // if (!/^[\d.]+$/.test(name)) {
        //     return Promise.reject("Not a number");
        // }
        // No injection detected
        return Promise.resolve();
    });
}
exports.checkInjection = checkInjection;

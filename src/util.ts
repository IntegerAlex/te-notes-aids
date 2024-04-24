export async function checkInjectionInt(id: string) {
    if (id.includes("DROP") || id.includes("DELETE") || id.includes("SELECT") || id.includes("UPDATE") || id.includes("INSERT") 
        || id.includes("CREATE") || id.includes("ALTER") || id.includes("TRUNCATE") || id.includes("DROP") || id.includes("UNION") 
        || id.includes("JOIN") || id.includes("FROM") || id.includes("WHERE") || id.includes("HAVING") || id.includes("GROUP BY") 
        || id.includes("ORDER BY") || id.includes("LIMIT") || id.includes("OFFSET") || id.includes("FETCH") || id.includes("EXISTS") 
        || id.includes("LIKE") || id.includes("IN")){
        return Promise.reject("Injection detected")
    }
    else if(parseInt(id, 10).toString() !== id){
        return Promise.reject("Not a number");
    }
    else{
        return Promise.resolve();
    }
}


export async function checkInjection(name: string) {
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
}


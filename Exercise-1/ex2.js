function printPattern() {
    // The number of rows
    const rows = 5; 
    for (let i = 0; i < rows; i++) {
        let line = '';
        for (let j = i; j < rows; j++) {
            line += '*';
        }
        // Print the line and trim 
        console.log(line.trim()); 
    }
}

printPattern();

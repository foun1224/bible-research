class BibleManager {
    constructor() {
        this.bibleData = {};
        this.books = [];
        this.currentBook = '';
        this.currentChapter = '';
    }

    async loadBible() {
        try {
            const response = await fetch('/bible_content/ckjv.txt');
            const text = await response.text();
            const lines = text.split('\n');
            
            lines.forEach(line => {
                if (line.trim()) {
                    const [reference, ...contentParts] = line.split(' ');
                    const content = contentParts.join(' ');
                    const [book, chapter] = this.parseReference(reference);
                    
                    if (!this.bibleData[book]) {
                        this.bibleData[book] = {};
                        this.books.push(book);
                    }
                    if (!this.bibleData[book][chapter]) {
                        this.bibleData[book][chapter] = [];
                    }
                    this.bibleData[book][chapter].push({
                        reference,
                        content: content.trim()
                    });
                }
            });
        } catch (error) {
            console.error('Failed to load Bible:', error);
        }
    }

    parseReference(ref) {
        const match = ref.match(/([^0-9]+)(\d+):?\d*/);
        if (match) {
            return [match[1], match[2]];
        }
        return ['', ''];
    }

    getBooks() {
        return this.books;
    }

    getChapters(book) {
        if (this.bibleData[book]) {
            return Object.keys(this.bibleData[book]).sort((a, b) => parseInt(a) - parseInt(b));
        }
        return [];
    }

    getVerses(book, chapter) {
        if (this.bibleData[book]?.[chapter]) {
            return this.bibleData[book][chapter];
        }
        return [];
    }

    search(query) {
        const results = [];
        const searchLower = query.toLowerCase();

        for (const book of Object.keys(this.bibleData)) {
            for (const chapter of Object.keys(this.bibleData[book])) {
                const verses = this.bibleData[book][chapter];
                verses.forEach(verse => {
                    if (verse.reference.toLowerCase().includes(searchLower) ||
                        verse.content.toLowerCase().includes(searchLower)) {
                        results.push(verse);
                    }
                });
            }
        }
        return results;
    }
}
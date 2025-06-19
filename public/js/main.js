document.addEventListener('DOMContentLoaded', async () => {
    const bibleManager = new BibleManager();
    await bibleManager.loadBible();

    const bookSelect = document.getElementById('bookSelect');
    const chapterSelect = document.getElementById('chapterSelect');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const bibleContent = document.getElementById('bibleContent');

    // 添加裝飾性元素
    createDustSprites();

    // 初始化書卷選擇
    const books = bibleManager.getBooks();
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book;
        option.textContent = book;
        bookSelect.appendChild(option);
    });

    // 書卷選擇事件
    bookSelect.addEventListener('change', (e) => {
        const book = e.target.value;
        updateChapterSelect(book);
    });

    // 章節選擇事件
    chapterSelect.addEventListener('change', (e) => {
        const book = bookSelect.value;
        const chapter = e.target.value;
        if (book && chapter) {
            displayVerses(book, chapter);
        }
    });

    // 搜尋功能
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            const results = bibleManager.search(query);
            displaySearchResults(results);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    function updateChapterSelect(book) {
        chapterSelect.innerHTML = '<option value="">選擇章節</option>';
        const chapters = bibleManager.getChapters(book);
        chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter;
            option.textContent = chapter;
            chapterSelect.appendChild(option);
        });
    }

    function displayVerses(book, chapter) {
        const verses = bibleManager.getVerses(book, chapter);
        bibleContent.innerHTML = '';
        verses.forEach(verse => {
            const verseElement = document.createElement('p');
            verseElement.className = 'verse';
            verseElement.innerHTML = `<span class="verse-ref">${verse.reference}</span> ${verse.content}`;
            bibleContent.appendChild(verseElement);
        });
        animateContent();
    }

    function displaySearchResults(results) {
        bibleContent.innerHTML = '';
        if (results.length === 0) {
            bibleContent.innerHTML = '<p class="no-results">未找到相關經文</p>';
            return;
        }
        results.forEach(verse => {
            const verseElement = document.createElement('p');
            verseElement.className = 'verse';
            verseElement.innerHTML = `<span class="verse-ref">${verse.reference}</span> ${verse.content}`;
            bibleContent.appendChild(verseElement);
        });
        animateContent();
    }

    function createDustSprites() {
        const decorations = document.querySelector('.ghibli-decorations');
        for (let i = 0; i < 5; i++) {
            const sprite = document.createElement('div');
            sprite.className = 'dust-sprite';
            sprite.style.left = `${Math.random() * 100}%`;
            sprite.style.animationDelay = `${Math.random() * 2}s`;
            decorations.appendChild(sprite);
        }
    }

    function animateContent() {
        const verses = document.querySelectorAll('.verse');
        verses.forEach((verse, index) => {
            verse.style.opacity = '0';
            verse.style.transform = 'translateY(20px)';
            verse.style.transition = 'all 0.5s ease';
            verse.style.transitionDelay = `${index * 0.1}s`;
            setTimeout(() => {
                verse.style.opacity = '1';
                verse.style.transform = 'translateY(0)';
            }, 100);
        });
    }
});

// 添加動態風格CSS
const style = document.createElement('style');
style.textContent = `
    .verse {
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-radius: 8px;
        background-color: rgba(255,255,255,0.7);
        transition: all 0.3s ease;
    }

    .verse:hover {
        background-color: rgba(133,185,157,0.1);
        transform: translateX(5px);
    }

    .verse-ref {
        color: var(--ghibli-blue);
        font-weight: bold;
        margin-right: 1rem;
    }

    .no-results {
        text-align: center;
        color: var(--ghibli-brown);
        font-size: 1.2rem;
        margin-top: 2rem;
    }
`;
document.head.appendChild(style);
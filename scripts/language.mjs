const language = {
    'en-US': 'English',
    'en-GB': 'English',
    'zh-CN': '中文',
    'zh-TW': '中文'
}

export function ltl(lang){
    return language[lang] ?? lang;
}
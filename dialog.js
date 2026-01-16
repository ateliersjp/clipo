function showHelp() {
    alert(`枠線の内側を${'ontouchstart' in window && 0 < navigator.maxTouchPoints ? 'タップ' : 'クリック'}してPDFを選択してください。
最大4枚の伝票を1枚のA4用紙に印刷できます。
なお、データは一切サーバに送信されません。`);
}

window.addEventListener('load', showHelp);

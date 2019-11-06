function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        // eslint-disable-next-line no-useless-escape
        "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
export default getCookie;
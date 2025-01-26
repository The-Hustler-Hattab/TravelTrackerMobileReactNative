



class StringUtil {

    /**
     * Retrieves the substring of the given text that appears before the specified delimiter.
     *
     * @param text - The input string from which to extract the substring.
     * @param delimiter - The delimiter used to determine where to split the text.
     * @returns The substring of the text that appears before the delimiter. If the delimiter is not found, the entire text is returned.
     */
    public static getWordsBeforeDelimiter(text: string, delimiter: string): string {
        if (text.includes(delimiter)) {
            return text.split(delimiter)[0];
        }else {
            return text;
        }

    }

}


export default StringUtil;
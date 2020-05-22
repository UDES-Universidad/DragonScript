namespace Utils {

    export function to_letterRange(col: number): string {
        const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
            'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        if (col > ALPHABET.length) {

            let principal_letter = Math.floor(col / ALPHABET.length);


        } else {
            return ALPHABET[col];
        }

    }

}
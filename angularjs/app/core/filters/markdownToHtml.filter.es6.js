export default function() {
    return function(input) {
        if ( !input ) {
            return;
        };

        let converter = new showdown.Converter();

        converter.setOption('tables', 'true');
        converter.setOption('literalMidWordUnderscores', 'true');
        converter.setOption('underline', 'true');

        return converter.makeHtml(input);
    };
}

import { Link } from '@mui/material';

function Instruction() {
    
    return (<>
        <p>This app is made for language learning that is actually helpful for your communication. It helps you to acquire vocabulary for the topics that you wish to speak about with your peers.</p>
        <ol>
            <li>Select the language you learn and your current level.</li>
            <li>Enter a topic that you are interested in or that you would like to learn more about.</li>
            <li>Click on "Generate" and wait approximately 15 seconds for your personalized text to be generated.</li>
            <li>Select words or phrases in the generated text that you would like to have explained and wait approximately 5 seconds for the explanation.</li>
            <li>Generate a vocabulary list with important words by clicking on the button below the text.</li>
            <li>Enter your mother tongue and click on "Export" to generate a simple text file containing the vocabulary and a translation to your langue.</li>
            <li>Import the comma-seperated text file to your favorite flashcard learning platform such as Anki to regularly study and retain the words.</li>
        </ol>
        <p>Language learners who can already read the language and have some basic vocabulary but struggle to understand media designed for a native audience benefit the most. It is highly recommended to actively engage in conversations with a tandem partner at this level of learning.</p>
        <p>This application was made by <Link href="https://dogl.de">Dominik Glandorf</Link>. Please feel free to reach out with feedback to <Link href="mailto:dominik.glandorf@yale.edu">dominik.glandorf@yale.edu</Link></p>
    </>)


}

export default Instruction;

export default function(config: object) {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    console.log("1) Change Access Token");
    console.log("2) Change Language");
    console.log("3) Change Color Scheme");
    console.log("4) Back");
}
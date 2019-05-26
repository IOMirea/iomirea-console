export default function(config: object) {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    console.log("1)\tChange Access Token");
    console.log("2)\tChange Language");
    console.log("3)\tChange Color Scheme");
    console.log("4)\tBack");
}
export default function(state: number) {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    console.log("1)\tView Channel");
    console.log("2)\tAccount Information");
    console.log("3)\tSettings");
    console.log("4)\tExit");
    console.log(state);
}
export default function(): void {
    console.log(`ID\t\t${this.user.id}`);
    console.log(`Username\t${this.user.name}`);
    console.log(`E-Mail:\t\t${this.user.email}`);
    console.log("(Press any key to go back)");
}
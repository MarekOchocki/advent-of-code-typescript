import { printAll2021Solutions } from "./2021/all-solutions";
import { printAll2023Solutions } from "./2023/all-solutions";
import { printAll2024Solutions } from "./2024/all-solutions";


function printAllSolutions() {
  printAll2021Solutions();
  printAll2023Solutions();
  printAll2024Solutions();
}

function printCurrentEdition() {
  printAll2024Solutions();
}

printCurrentEdition();

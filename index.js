import * as readline from "node:readline/promises";
import { stdout as output, stdin as input } from "node:process";

class Pet {
  id;
  name;
  age;
  daysAttended;

  constructor(id, name, age, daysAttended) {
    this.daysAttended = daysAttended;
    this.name = name;
    this.age = age;
    this.id = id;
  }
}

class PetRepository {
  _pets = [];

  save(pet) {
    pet.daysAttended = parseFloat(pet.daysAttended);
    pet.age = parseFloat(pet.age);
    if (!this._pets.some((v) => v.id === pet.id)) {
      this._pets.push(pet);
    } else {
      throw new Error("Pet with the same id already exists");
    }
  }

  update(pet) {
    const index = this._pets.findIndex((v) => v.id === pet.id);

    if (index > -1) {
      const appliedChangeset = { ...this._pets[index], ...pet };
      appliedChangeset.age = parseFloat(`${appliedChangeset.age}`);
      appliedChangeset.daysAttended = parseFloat(
        `${appliedChangeset.daysAttended}`,
      );

      this._pets[index] = appliedChangeset;
    } else {
      throw new Error("Pet with the ID doesn't exist");
    }
  }

  allPets() {
    return [...this._pets];
  }

  findById(id) {
    return this._pets.find((v) => v.id === id);
  }

  findByName(name) {
    return this._pets.find(
      (v) => v.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
  }

  deleteById(id) {
    const index = this._pets.findIndex((v) => v.id === id);
    if (index !== -1) {
      this._pets.splice(index, 1);
    } else {
      throw new Error("ID doesn't exist");
    }
  }
}

const petRepository = new PetRepository();

const r1 = readline.createInterface({ input, output });

async function main() {
  while (true) {
    console.log(String.raw`What do you want to do?
1) Create pet
2) Find pet by ID
3) Find pet by Name
4) List all pets
5) Update pet
6) Delete pet by ID
`);
    const action = await r1.question("Answer (input number): ");
    switch (action) {
      case "1":
        {
          console.log("Pet's Information: ");
          const id = await r1.question("ID: ");
          const name = await r1.question("Name: ");
          const age = await r1.question("Age: ");
          const daysAttended = await r1.question("Days Attended: ");
          const pet = { id, name, age, daysAttended };
          try {
            petRepository.save(pet);
            console.log("Pet is saved: ", pet);
          } catch (e) {
            console.log("ERROR: Pet is not saved: ", pet);
            console.log(`ERROR: ID (${id}) is already taken`);
          }
        }

        break;
      case "2":
        {
          const id = await r1.question("ID: ");
          const pet = petRepository.findById(id);
          if (pet !== undefined) {
            console.log("Pet found: ", pet);
          } else {
            console.log("Pet not foud");
          }
        }
        break;
      case "3":
        {
          const name = await r1.question("Name: ");
          const pet = petRepository.findByName(name);
          if (pet !== undefined) {
            console.log("Pet found: ", pet);
          } else {
            console.log("Pet not foud");
          }
        }
        break;
      case "4":
        {
          const all = petRepository.allPets();
          if (all.length > 0) {
            all.forEach((v) => console.log(v));
          } else {
            console.log("There are no pets...");
          }
        }
        break;
      case "5":
        {
          console.log("Pet's Information: ");
          const id = await r1.question("ID: ");
          const name = await r1.question("Name: ");
          const age = await r1.question("Age: ");
          const daysAttended = await r1.question("Days Attended: ");
          const pet = { id, name, age, daysAttended };
          try {
            petRepository.update(pet);
            console.log("Pet is updated: ", pet);
          } catch (e) {
            console.log(`ERROR: ${e.message}`);
          }
        }
        break;
      case "6":
        {
          const id = await r1.question("ID: ");
          try {
            petRepository.deleteById(id);
            console.log("Pet is deleted");
          } catch (e) {
            console.log(`ERROR: ${e.message}`);
          }
        }
        break;
      default:
        {
          console.log(`Action (${action}) not supported`);
        }
        break;
    }

    const cont = await r1.question("Choose another action? y/n: ");

    switch (cont.toLowerCase()) {
      case "y":
        process.stdout.write("\x1bc");
        break;
      case "n":
        r1.close();
        console.log("Exiting...");
        return;
      default:
        console.log("Invalid answer. Exiting...");
        r1.close();
        return;
    }
  }
}

main();

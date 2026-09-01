import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// Structure du profil
interface DevProfile {
    name: string;
    city: string;
    experienceYears: number;
    available: boolean;
    weeklyHours: number;
    technologies: string[];
    favoriteEditor?: string;
}

// Vérifie si le développeur est disponible
function getAvailabilityStatus(profile: DevProfile): string {
    if (profile.available && profile.weeklyHours >= 8) {
        return "DISPONIBLE";
    } else {
        return "INDISPONIBLE";
    }
}

// Calcul du score
function computeProfileScore(profile: DevProfile): number {
    const experienceScore = profile.experienceYears * 5;
    const technologyScore = profile.technologies.length * 10;
    const availabilityScore = profile.weeklyHours;

    const score = experienceScore + technologyScore + availabilityScore;

    // Maximum 100
    return Math.min(score, 100);
}

// Classe Developer
class Developer {
    name: string;
    city: string;
    experienceYears: number;
    available: boolean;
    weeklyHours: number;
    technologies: string[];
    favoriteEditor?: string;

    // Récupère les infos du profil
    constructor(profile: DevProfile) {
        this.name = profile.name;
        this.city = profile.city;
        this.experienceYears = profile.experienceYears;
        this.available = profile.available;
        this.weeklyHours = profile.weeklyHours;
        this.technologies = profile.technologies;
        this.favoriteEditor = profile.favoriteEditor;
    }

    // Récupère le statut
    getStatus(): string {
        return getAvailabilityStatus(this);
    }

    // Récupère le score
    getScore(): number {
        return computeProfileScore(this);
    }

    // Affiche le profil
    printSummary(): void {
        console.log("=== DEVBOARD CLI ===");
        console.log(`Nom         : ${this.name}`);
        console.log(`Ville       : ${this.city}`);
        console.log(`Experience  : ${this.experienceYears} ans`);
        console.log(`Disponible  : ${this.available ? "oui" : "non"}`);
        console.log(`Technos     : ${this.technologies.join(", ")}`);
        console.log(`Charge      : ${this.weeklyHours} h/semaine`);
        console.log(`Statut      : ${this.getStatus()}`);
        console.log(`Score       : ${this.getScore()}/100`);
        console.log("====================");
    }
}

// Programme principal
async function main(): Promise<void> {
    const rl = createInterface({ input, output });

    // Demande le prénom dans le terminal
    const name = await rl.question("Quel est ton prénom ? ");

    console.log(`Bonjour ${name} !`);
    console.log("DevBoard va maintenant afficher ton profil.");

    rl.close();

    // Création du développeur
    const developer = new Developer({
        name: name,
        city: "Liège",
        experienceYears: 8,
        available: true,
        weeklyHours: 40,
        technologies: ["TypeScript", "Node.js", "Git", "Java"],
        favoriteEditor: "VS Code"
    });

    developer.printSummary();
}

main();
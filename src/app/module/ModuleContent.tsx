// app/module/ModuleContent.tsx
"use client";

import ClassicalCryptography from "../learningPath/ClassicalCryptography";
import FundamentalsCryptography from "../learningPath/FundamentalsCryptography";
import SymmetricCryptography from "../learningPath/SymmetricCryptography";
import HashFunctions from "../learningPath/HashFunctions";
import { useSearchParams } from "next/navigation";

const moduleMap = {
    "Criptografía Clásica": ClassicalCryptography,
    "Fundamentos de la Criptografía": FundamentalsCryptography,
    "Criptografía Simétrica": SymmetricCryptography,
    "Funciones Hash Criptográficas": HashFunctions,
};

export default function ModuleContent() {
    const searchParams = useSearchParams();
    const name = searchParams.get("name");

    const option =
        typeof name === "string" && name in moduleMap
            ? name
            : "Criptografía Simétrica";
    const SelectedModule = moduleMap[option as keyof typeof moduleMap];

    return (
        <div>
            {SelectedModule ? <SelectedModule /> : <div>Module not found</div>}
        </div>
    );
}

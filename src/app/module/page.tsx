"use client"
import ClassicalCryptography from "../learningPath/ClassicalCryptography";
import FundamentalsCryptography from "../learningPath/FundamentalsCryptography";
import SymmetricCryptography from "../learningPath/SymmetricCryptography";
import HashFunctions from "../learningPath/HashFunctions";
import { useParams } from "next/navigation";

const moduleMap = {
    classical: ClassicalCryptography,
    fundamentals: FundamentalsCryptography,
    symmetric: SymmetricCryptography,
    hash: HashFunctions,
};

export default function Module() {

    const { module } = useParams();

    const option =
        typeof module === "string" && module in moduleMap
            ? module
            : "hash";
    const SelectedModule = moduleMap[option as keyof typeof moduleMap];

    return (
        <div>
            {SelectedModule ? <SelectedModule /> : <div>Module not found</div>}
        </div>
    );
}

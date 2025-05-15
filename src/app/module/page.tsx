import ClassicalCryptography from "../learningPath/ClassicalCryptography";
import FundamentalsCryptography from "../learningPath/FundamentalsCryptography";
import SymmetricCryptography from "../learningPath/SymmetricCryptography";
import HashFunctions from "../learningPath/HashFunctions";
import AsymmetricCryptography from "../learningPath/AsymmetricCryptography";

const moduleMap = {
    classical: ClassicalCryptography,
    fundamentals: FundamentalsCryptography,
    symmetric: SymmetricCryptography,
    hash: HashFunctions,
    asymmetric: AsymmetricCryptography,
};

export default function Module() {
    const option = "hash";
    const SelectedModule = moduleMap[option];

    return (
        <div>
            {SelectedModule ? <SelectedModule /> : <div>Module not found</div>}
        </div>
    );
}

import ClassicalCryptography from "../learningPath/ClassicalCryptography";
import FundamentalsCryptography from "../learningPath/FundamentalsCryptography";
import SymmetricCryptography from "../learningPath/SymmetricCryptography";
import HashFunctions from "../learningPath/HashFunctions";
import AsymmetricCryptography from "../learningPath/AsymmetricCryptography";
import DigitalSignatures from "../learningPath/DigitalSignatures";
import CryptographicProtocols from "../learningPath/CryptographicProtocols";
import SecurityVulnerabilities from "../learningPath/SecurityVulnerabilities";

const moduleMap = {
    classical: ClassicalCryptography,
    fundamentals: FundamentalsCryptography,
    symmetric: SymmetricCryptography,
    hash: HashFunctions,
    asymmetric: AsymmetricCryptography,
    digital: DigitalSignatures,
    protocols: CryptographicProtocols,
    vulnerabilities: SecurityVulnerabilities,
};

export default function Module() {
    const option = "vulnerabilities";
    const SelectedModule = moduleMap[option];

    return (
        <div>
            {SelectedModule ? <SelectedModule /> : <div>Module not found</div>}
        </div>
    );
}

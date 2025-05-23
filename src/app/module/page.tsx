import { Suspense } from "react";
import ModuleContent from "./ModuleContent";

export default function ModulePage() {
    return (
        <Suspense fallback={<div>Loading module...</div>}>
            <ModuleContent />
        </Suspense>
    );
}

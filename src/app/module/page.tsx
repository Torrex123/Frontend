import { Suspense } from "react";
import ModuleContent from "./ModuleContent";

export default function ModulePage() {
    return (
        <Suspense fallback={<div>Cargando modulo...</div>}>
            <ModuleContent />
        </Suspense>
    );
}

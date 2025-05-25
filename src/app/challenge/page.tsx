import { Suspense } from 'react';
import ChallengePage from './ChallengeModule';

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center gap-4 text-base-content">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <span className="text-lg font-semibold">Cargando desafío...</span>
                    </div>
                }
            >
                <ChallengePage />
            </Suspense>
        </div>
    );
}

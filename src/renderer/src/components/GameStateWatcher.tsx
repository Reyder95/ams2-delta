import { useTelemetry } from "@renderer/hooks/useTelemetry";

export default function GameStateWatcher() {
    const { data, error } = useTelemetry(['gameStates'], 500)

    if (error) return <div>CREST2 not reachable: {error}</div>
    if (!data) return <div>Waiting for data...</div>

    return (
        <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}
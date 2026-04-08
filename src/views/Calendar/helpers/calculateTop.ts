export function calculateTop(time: string) {
    const [h, m] = time.split(':').map(Number);
    return (h - 8) * 96 + (m / 60) * 96;
}

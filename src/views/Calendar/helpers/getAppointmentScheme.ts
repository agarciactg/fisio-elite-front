export function getAppointmentScheme(status: string) {
    switch (status) {
        case 'confirmed':
            return {
                bg: 'bg-green-100',
                border: 'border-green-600',
                text: 'text-green-900',
            };
        case 'arrived':
            return {
                bg: 'bg-cyan-100',
                border: 'border-cyan-600',
                text: 'text-cyan-900',
            };
        case 'canceled':
            return {
                bg: 'bg-red-100',
                border: 'border-red-600',
                text: 'text-red-900',
            };
        default:
            return {
                bg: 'bg-gray-100',
                border: 'border-gray-400',
                text: 'text-gray-800',
            };
    }
}

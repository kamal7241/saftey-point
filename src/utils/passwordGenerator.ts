export const generateStrongPassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const getRandomChar = (str: string) => str[Math.floor(Math.random() * str.length)];
    
    return [
        getRandomChar(uppercase),
        getRandomChar(lowercase),
        getRandomChar(numbers),
        getRandomChar(special),
        ...Array(4).fill('')
            .map(() => getRandomChar(uppercase + lowercase + numbers + special))
    ].sort(() => Math.random() - 0.5).join('');
};
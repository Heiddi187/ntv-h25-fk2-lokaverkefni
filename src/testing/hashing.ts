import bcrypt from 'bcrypt';

(async () => {
    const hash = await bcrypt.hash('secret123', 12);
    console.log(hash);
})();
import { execSync } from "child_process";


interface SetupDB {
    isDev: boolean
}
// --- NOVA FUNÇÃO PARA GARANTIR A DB ---
export async function setupDatabase() {
    try {
        console.log('🔄 Verificando banco de dados...')

        // No dev, o render está em ../render
        // No prod, você precisará ajustar o caminho conforme seu build
        const renderPath = "./"

        // Executa o push do drizzle de forma síncrona antes de abrir a janela
        execSync('npm run db:push', {
            cwd: renderPath,
            stdio: 'inherit', // Mostra o log no terminal do electron
        });

        console.log('✅ Banco de dados pronto!');
    } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error);
        // Opcional: Impedir o app de abrir se a DB falhar
    }
}
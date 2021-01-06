import LexerClient from './client/clientstruct';
const client = new LexerClient(
    {   
        token: 'Nzk0OTE3MDEzMzA2MDgxMzMx.X_ByKA.Kn2IkTAAgSLeh_sN69f72qtTmPk', 
        presence: { activity: { type: 'PLAYING', name: 'with code'}, status: 'dnd'},
        prefix: '.'
    });

client.start()
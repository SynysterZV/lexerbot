import Client from '../client/clientstruct'

export = (client: Client) => {
    console.log(`READY! Logged in as ${client?.user?.tag}`)
}
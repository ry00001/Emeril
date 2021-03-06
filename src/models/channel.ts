import axios from "axios";
import {EmerilClient} from "..";
import {EmerilException} from "../misc";
import { apiCall, DiscordChannelType } from "../constants";
import DiscordGuild from "./guild";
import DiscordInvite from "./invite";

export default class DiscordChannel {
    public id: string;
    public type: DiscordChannelType;
    public guild?: DiscordGuild;
    public name: string;
    public client: EmerilClient;

    public _d: any;

    constructor(d: any, client: EmerilClient, guild?: DiscordGuild) {
        this.id = d.id;
        this.type = d.type as DiscordChannelType;
        this.guild = guild;
        this.name = d.name;
        this._d = d;
        this.client = client;
    }

    public makeTextable(): any {
        let textable = (this.type === DiscordChannelType.GUILD_TEXT) ||
                       (this.type === DiscordChannelType.DM) ||
                       (this.type === DiscordChannelType.GROUP_DM);
        if (!textable) {
            throw new EmerilException('Channel is not textable.');
        }

        // I'm sorry, typescript has forced my hand
        return new (require('./textable').default)(this._d, this.client, this.guild);
    }

    public asTextable(): any {
        try {
            return this.makeTextable();
        } catch(e) {
            return null;
        }
    }

    public createInvite(maxAge: number = 0, maxUses: number = 0): Promise<DiscordInvite> {
        return this.guild.createInvite(this, maxAge, maxUses);
    }
}
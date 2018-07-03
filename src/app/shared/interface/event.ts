export class ProteaParty {
    public name  = '';
    public limitOfParticipants = 0;
    public coolingPeriod = 0;
    public deposit = 0;
    public registered = 0;
    public attended = 0;
    public encryption = '';
    public payout = 0;
    public ended = false;
    public totalBalance = 0;

    public constructor(init?: Partial<ProteaParty>) {
        Object.assign(this, init);
    }
}

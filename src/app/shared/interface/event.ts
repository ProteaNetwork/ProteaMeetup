export class ProteaMeetup {
    public address = '';
    public name  = '';
    public limitOfParticipants = 0;
    public coolingPeriod = 0;
    public deposit = 0;
    public registered = 0;
    public attended = 0;
    public encryption = '';
    public payout = 0;
    public ended = false;
    public cancelled = false;
    public totalBalance = 0;
    public endAt = 0;
    public cooledDown = 0;

    public constructor(init?: Partial<ProteaMeetup>) {
        Object.assign(this, init);
    }
}

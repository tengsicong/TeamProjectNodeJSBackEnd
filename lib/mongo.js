const config = require('config-lite')(__dirname);
const mongoose = require('mongoose');
// const Mongolass = require('mongolass')
const Schema = mongoose.Schema;
// const Schema = Mongolass.Schema;
// const mongolass = new Mongolass()
mongoose.connect(config.mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'TeamProject',
});

const replySchema = new Schema({
    Author: String,
    Comment: String,
    ReplyDate: Date,
});

const studentSchema = new Schema({
    UserName: String,
    Password: String,
    Name: String,
    GroupID: {type: Schema.Types.ObjectId, ref: 'teams'},
    ProposalID: {type: Schema.Types.ObjectId, ref: 'proposals'},
    StudentID: {type: Schema.Types.ObjectId, ref: 'students'},
    PeoplePreference: [Number],
    PeopleLike: {type: Schema.Types.ObjectId, ref: 'students'},
    PeopleDontLike: [{type: Schema.Types.ObjectId, ref: 'students'}],
    Mark: [Number],
    MarkID: [{type: Schema.Types.ObjectId, ref: 'students'}]
});

const students = mongoose.model('students', studentSchema);

const adminSchema = new Schema({
    UserName: String,
    Password: String,
    Name: String
});

const admins = mongoose.model('admins', adminSchema);

const clientSchema = new mongoose.Schema({
    UserName: String,
    Password: String,
    Name: String,
    Email: String,
    GroupID: {type: Schema.Types.ObjectId, ref: 'teams'},
    AllProposalID: [{type: Schema.Types.ObjectId, ref: 'proposals'}],
});

const clients = mongoose.model('clients', clientSchema);

const staffSchema = new mongoose.Schema({
    Name: String,
    UserName: String,
    Password: String,
    AllocatedTeamID: [{type: Schema.Types.ObjectId, ref: 'teams'}],
});

const staffs = mongoose.model('staffs', staffSchema);

const proposalSchema = new mongoose.Schema({
    Status: String,
    Date: Date,
    Topic: String,
    Content: String,
    ClientID: {type: Schema.Types.ObjectId, ref: 'clients'},
    GroupID: [{type: Schema.Types.ObjectId, ref: 'teams'}],
    Reply: [replySchema],
});

const proposals = mongoose.model('proposals', proposalSchema);

const teamSchema = new mongoose.Schema({
    ProposalID: {type: Schema.Types.ObjectId, ref: 'proposals'},
    Topic: {type:Schema.Types.ObjectId, ref: 'proposals'},
    StudentID: [{type: Schema.Types.ObjectId, ref: 'students'}],
    StaffID: {type: Schema.Types.ObjectId, ref: 'staffs'},
    Preference: [{type: Schema.Types.ObjectId, ref: 'proposals'}],
    Representer: {type: Schema.Types.ObjectId, ref: 'students'},
    ClientMark: [Number],
    ClientMarkReason: [String],
    StaffMark: [Number],
    StaffMarkReason: [String],
    ClientMeetingID: [{type: Schema.Types.ObjectId, ref: 'client_meetings'}],
    StaffMeetingID: [{type: Schema.Types.ObjectId, ref: 'staff_meetings'}],
    TeamName: {type: Number},
});

const teams = mongoose.model('teams', teamSchema);

const clientMeetingsSchema = new mongoose.Schema({
    GroupID: {type: Schema.Types.ObjectId, ref: 'teams'},
    Date: Date,
    Place: String,
    ClientID: {type: Schema.Types.ObjectId, ref: 'clients'},
});

const client_meetings = mongoose.model('client_meetings', clientMeetingsSchema);

const staffsMeetingSchema = new mongoose.Schema({
    GroupID: {type: Schema.Types.ObjectId, ref: 'teams'},
    Number: Number,
    Date: Date,
    Place: String,
    StaffID: {type: Schema.Types.ObjectId, ref: 'staffs'},
    TemporaryStaffID: {type: Schema.Types.ObjectId, ref: 'staffs'},
    RecordID: {type: Schema.Types.ObjectId, ref: 'staff_meeting_records'},
});

const staff_meetings = mongoose.model('staff_meetings', staffsMeetingSchema);

const staffMeetingRecords = new mongoose.Schema({
    Date: Date,
    LastMeetingNote: String,
    AchievePlan: String,
    Change: [Boolean],
    ChangeOther: String,
    RequirementCapture: Number,
    TeamProgress: Number,
    TimeSheets: Number,
    ClearPlan: Number,
    Dynamics: Number,
    AnyOtherNotes: String,
});

const staff_meeting_records = mongoose.model('staff_meeting_records', staffMeetingRecords);

const changeStaffMeetingRequestSchema = new mongoose.Schema({
    MeetingID: {type: Schema.Types.ObjectId, ref: 'staff_meetings'},
    StaffID: {type: Schema.Types.ObjectId, ref: 'staffs'},
    Status: String,
    NewMeetingTime: Date,
    NewStaffID: {type: Schema.Types.ObjectId, ref: 'staffs'},
    RequestComment: {
        RequestName: String,
        Date: Date,
        Content: String,
    },
    AdminReply: {
        AdminName: String,
        Date: Date,
        Content: String,
    },
});

const change_staff_meeting_requests = mongoose.model('change_staff_meeting_requests', changeStaffMeetingRequestSchema);

const changeClientMeetingRequestSchema = new mongoose.Schema({
    MeetingID: {type: Schema.Types.ObjectId, ref: 'client_meetings'},
    ClientID: {type: Schema.Types.ObjectId, ref: 'client'},
    Status: String,
    NewMeetingTime: Date,
    RequestComment: {
        RequestName: String,
        Date: Date,
        Content: String,
    },
    AdminReply: {
        AdminName: String,
        Date: Date,
        Content: String,
    },
});

const change_client_meeting_requests = mongoose.model('change_client_meeting_requests', changeClientMeetingRequestSchema);

const studentStaffQASchema = new mongoose.Schema({
    GroupID: {type: Schema.Types.ObjectId, ref: 'teams'},
    Topic: String,
    Replies: [replySchema],
});

const student_staff_qas = mongoose.model('student_staff_qas', studentStaffQASchema);

const noticeSchema = new mongoose.Schema({
    Event: String,
    ClientID: {type: Schema.Types.ObjectId, ref: 'clients'},
    StaffID: {type: Schema.Types.ObjectId, ref: 'staffs'},
    StudentID: {type: Schema.Types.ObjectId, ref: 'students'},
    AdminID: {type: Schema.Types.ObjectId, ref: 'admins'},
});

const notices = mongoose.model('notices', noticeSchema);

const stageSchema = new mongoose.Schema({
    Stage: Number,
});

const stages = mongoose.model('stages', stageSchema);

module.exports={
    students,
    admins,
    clients,
    staffs,
    proposals,
    teams,
    client_meetings,
    staff_meetings,
    staff_meeting_records,
    change_staff_meeting_requests,
    change_client_meeting_requests,
    student_staff_qas,
    notices,
    stages,
};



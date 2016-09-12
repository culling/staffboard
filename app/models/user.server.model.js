var mongoose    = require('mongoose');
var crypto      = require('crypto');
var Schema      = mongoose.Schema;

var UserSchema = new Schema({
    firstName:  {
        type:   String,
        trim:   true,
        required:   "First name is required"
    },
    lastName:   String,
    email:      {
        type:   String,
        index:  true,
        match:  [/.+\@.+\..+/,  "please fill a valid e-mail address"],
        required:   "Email is required"
    },
    username:   {
        type:   String,
        trim:   true,
        unique: true,
        required:   "Username is required"
    },
    password:   {
        type:   String,
        validate:   [
            function(password){
                return password.length >= 8;
            },
                'Password should be longer'
        ]
    },
    salt:   {
        type:   String
    },
    provider:   {
        type:   String,
        required:   'Provider is required'
    },
    providerId: {
        type:   String
    },
    providerData:   {},
    created:    {
        type:   Date,
        default:    Date.now
    },
    website:    {
        type:   String,
        set:    function(url){
            if(!url){
                return url;
            }else{
                if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0 ){
                    url = 'http://' + url;
                }
                return url;
            }

        }
    },
    role:   {
        type:   String,
        enum:   ['Admin','User'],
        default:    'User'
    },
    status: {
        type:   String,
        required:   true,
        default:    'No Status',

    },
    officePhone:    {
        type:   String
    },
    organisation:   {
        type:   String
    },
    title:  {
        type:   String
    },
    department: {
        type:   String
    },
    description:    {
        type:   String
    }
});

UserSchema.virtual('fullName').get(function(){
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName){
    var splitName   =   fullName.split(' ');
    this.firstName  =   splitName[0] || '';
    this.lastName   =   splitName[1] || ''; 
}); // Virtual attributes


UserSchema.pre('save', function (next){
    if (this.password){
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'),'base64' );
        this.password = this.hashPassword(this.password);

    }
    next();
} );

UserSchema.methods.hashPassword = function(password){
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password){
    return this.password === this.hashPassword(password);
};

UserSchema.set('toJSON',{
    getters: true,
    virtuals: true}
);



mongoose.model('User', UserSchema);

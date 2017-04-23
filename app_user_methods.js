
/**
 * Adds the user to the database.
 * @param {String} username 
 * @param {String} name 
 * @param {String} email 
 * @param {String} password 
 * @param {function(result, doc)} callback 
 */
function AddUser(username, name, email, password, callback)
{
    this.users.findOne({ username: username }, function(err, res)
    {
        // Checks if there was a result.
        if(res)
        {
            if(callback)
                callback(false);   
        }
        // If there wasn't, we can add the user.
        else
        {
            var salt = this.bcrypt.genSaltSync(10);
            this.users.insert(
            { 
                username: username, 
                name: name,
                email: email,
                password: this.bcrypt.hashSync(password, salt) 
            }, function(err, res)
            {
                if(err == null)
                {
                    if(callback)
                        callback(true, res);
                }
                else 
                {
                    if(callback)   
                        callback(false);
                }
            });    

        }
    });
}

/**
 * 
 * @param {String} username 
 * @param {String} name 
 * @param {String} email 
 * @param {String} password 
 * @param {function(err, doc)} callback 
 */
function GetOrAddUser(username, name, email, password, callback)
{
    GetUser(username, function(found, doc)
    {
        if(found)
        return callback(true, doc);

        AddUser(username, name, email, password, callback);
    });
}


/**
 * @param {String} id
 * @param {String} username
 */
function ChangeUserName(id, username)
{
    var update = { "$set": { "username": username } };
    this.users.update({_id: id }, update);
}

/**
 * @param {String} id
 * @param {String} name
 */
function ChangeName(id, name)
{
    var update = { "$set": { "name": name } };
    this.users.update({_id: id }, update);
}


/**
 * Returns the User id.
 * @param {String} username 
 * @param {function(name)} callback 
 */
function GetUserIdFromUsername(username, callback)
{
    GetUser(username, function(found, doc)
    {
        if(found)
        {
            return callback(username);
        }
        return callback(null);
    });
}


/**
* Finds the user and returns the user's data if it exists.
* @param {String} username
* @param {function(found,doc)} callback
*/
function GetUser(username, callback)
{
    this.users.findOne({ username: username }, function(err, res)
    {
        if(err && callback) 
            return callback(false, null);

         // Checks if there was a result.
        if(res && callback)
        {
            callback(true, res);   
            return;
        }

        if(callback)
        callback(false, null);
    });
}


/**
* Checks the password.
* @param {String} username
* @param {String} password
* @param {function(doc)} correct 
* @param {function} wrong
*
*/
function CheckPassword(username, password, correct, wrong)
{
    GetUser(username, function(exists, doc)
    {
        if(exists)
        {
            this.bcrypt.compare(password, doc.password, function(err, result)
            {

                if (err && wrong) return wrong();
                if (result && correct) return correct(doc);
                
                if(wrong)
                return wrong();
            });
        }
        else
        {
            if(wrong)
            return wrong();
        }
    });
}

module.exports = function(users, bcrypt)
{
    this.bcrypt = bcrypt;
    this.users = users;
    this.CheckPassword = CheckPassword;
    this.GetOrAddUser = GetOrAddUser;
    this.AddUser = AddUser;
    this.GetUser = GetUser;
    this.ChangeName = ChangeName;
    this.ChangeUserName = ChangeUserName;
}

* how to sign in `http :5000/signin -a ddavis:mypass`
* how to sign up `echo '{"username":"vis", "password":"mypass"}' | http :5500/signup`
* HOW TO SET ENV VARS `JWT=-your jwt`
* how to make a new note `echo '{"noteBody":"heres my ne"}' | http :5500/notes Authorization:"
Bearer $JWT"`
* how to get notes `http :5500/notes Authorization:"Bearer $JWT"`

# Supalist

## Another shot at using some cool supabase features to create a list app with NextJS App Router

made with:

- Supabase
- ShadCN UI
- Next13 App Router
- Tailwind CSS

I got a pretty good start, but I was kind of banking on the client js supabase library to come through and help me out. The realtime and auth features are great, but there's a lot of gaps. I would like to be able to share a list with other users, but there's not a great way to query from the auth schema. I find myself designing my data around the js client and supabase to make things easier. I think the way to go would treat it like a hosted Postgres DB and bring your own query library.

Probably calling it quits for now. I don't really want to spend my time making workarounds or re-implementing the client features with another ORM. Maybe I'll persue that route at some point. What I've learned is:

- Supabase is super easy to use and as a hosted, free postgres offering it's seems pretty good for hobby stuff.
- It's super easy to spin up something with the client JS library, but it might falls short for what you want to do. You can rely on postgres knowledge to create workarounds, but it seems hacky.
- ShadCN UI is brilliant. It's so easy to use and I like being able to import and modify components
- App router has it's quirks and trying to integrate realtime updates with server components probably isn't the best idea. I think it's best at some point to treat a sub-tree of your app as a regular client app. Seem amazing for more traditional web sites and simpler apps though.

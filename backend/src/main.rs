use std::{
    fs,
    io::{BufRead, BufReader},
    time::Duration,
};

use rocket::{
    form::Form,
    fs::FileServer,
    futures::io,
    response::stream::{Event, EventStream, TextStream},
    tokio::time::sleep,
    Data,
};

#[macro_use]
extern crate rocket;

#[get("/delay/<seconds>")]
async fn delay(seconds: u64) -> String {
    sleep(Duration::from_secs(seconds)).await;
    format!("Delayed for {} seconds", seconds)
}
#[get("/foo/<_>/bar")]
fn foo_bar() -> &'static str {
    "Foo _____ bar!"
}
struct User<'a> {
    pub username: &'a str,
    pub password: &'a str,
}

#[post("/login", data = "<user>")]
fn login(user: Data) {}

#[get("/events")]
fn events() -> EventStream![] {
    let file = fs::File::open("answer.md").unwrap();
    let reader = BufReader::new(file);
    let wait = || sleep(Duration::from_millis(20));

    let stream = EventStream! {
         yield Event::data("start").id("start");
        for line in reader.lines() {
            let line = line.unwrap_or(String::from(""));
            for char in line.chars(){
                wait().await;
                yield Event::data(char.to_string()).id("data");
            }
            wait().await;
            yield Event::data("\n").id("data");
        }
    yield Event::data("end").id("end");
    };
    stream.heartbeat(None)
}

#[get("/<_..>")]
fn everything() -> &'static str {
    "Hey, you're here."
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    let _rocket = rocket::build()
        .mount("/", routes![login, delay, foo_bar, events, everything])
        .mount("/files", FileServer::from("static/")) //文件服务
        .launch()
        .await?;

    Ok(())
}

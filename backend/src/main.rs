use std::{fs, time::Duration};

use rocket::{
    form::Form,
    fs::FileServer,
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
    let answerContent =
        fs::read_to_string("answer.txt").unwrap_or(String::from("open files error"));
    let stream = EventStream! {
        yield Event::data("start").id("start");
        for s in answerContent.chars() {
            sleep(Duration::from_millis(30)).await;
            yield Event::data(s.to_string()).id("answer");
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

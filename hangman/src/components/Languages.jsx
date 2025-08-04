import React from "react";
import { languages } from "../assets/languages";

export default function Languages() {

  const languageElements = languages.map(item => {
    const styles = {
      backgroundColor: item.backgroundColor,
      color: item.color
    }
    return (
      <span className="chip"
        style={styles}
        key={item.name}>
        {item.name}
      </span>
    )
  })
  return (
    <section className="language-chips">
      {languageElements}
    </section>
  )
}
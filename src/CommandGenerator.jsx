import React, { Component } from "react";

export default class CommandGenerator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            command: ''
        }
    }
    handleInputChanged = (ev) => {
      this.handleEventChanged(ev);
    }
    handleSelectChanged = (ev) => {
        this.handleEventChanged(ev);
    }
    handleEventChanged = (ev, cb) => {
        this.setState({
            [ev.target.id]: ev.target.value
        }, this.refreshCommand);
    }
    handleContentsChanged = (ev) => {
        const contents = ev.target.value;
        const bookContents = contents;
        let start = 0, rows = 0, cols = 0, pages = [];
        for(var i = 0; i < bookContents.length; i++) {
            if(bookContents[i] === '\n') {
                rows++;
                cols = 0;
            } else {
                cols++;
            }
            if(cols >= 19) {
                rows++;
                cols = 0;
            }
            if(rows === 14) {
                pages.push(bookContents.slice(start, i).replace(/'/g, "\\'").replace(/\n/g, "\\\\n"));
                rows = 0;
                cols = 0;
                start = i;
            }
        }
        pages.push(bookContents.slice(start, i));
        this.setState({
            pages
        }, this.refreshCommand);
    }
    refreshCommand = () => {
        const { target, title, author, lore, pages } = this.state;
        this.setState({ command: `/give ${target} written_book{pages: [${pages && pages.map((page) => `'{"text":"${page}"}'`).join(',')}], title: "${title}", author: "${author}", display:{Lore:['{"text":"${lore}"}']}}` });
    }
    render() {
        return (
            <>
                <div>
                    <select id="target" placeholder="Select" onChange={this.handleSelectChanged} defaultValue="">
                        <option value={null}></option>
                        <option value="@p">Closest Player</option>
                    </select>
                </div>
                <div>
                    <input id="title" type="text" placeholder="Title" onChange={this.handleInputChanged}></input>
                </div>
                <div>
                    <input id="author" type="text" placeholder="Author" onChange={this.handleInputChanged}></input>
                </div>
                <div>
                    <input id="lore" type="text" placeholder="Lore" onChange={this.handleInputChanged}></input>
                </div>
                <div>
                    <textarea id="contents" type="text" onChange={this.handleContentsChanged} rows={14} cols={19}></textarea>
                </div>
                <div>
                    <button>Refresh Command</button>
                </div>
                <div>
                    {this.state.command}
                </div>
            </>
        );
    }
}
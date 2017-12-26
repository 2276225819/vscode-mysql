"use strict";
import * as keytarType from "keytar";
import * as vscode from "vscode";
import { IConnection } from "../model/connection";

export class Global {
    public static keytar: typeof keytarType = require(`${vscode.env.appRoot}/node_modules/keytar`);
    public static keyword: string;

    static get activeConnection(): IConnection {
        return Global._activeConnection;
    }

    static set activeConnection(newActiveConnection: IConnection) {
        this._activeConnection = newActiveConnection;
        Global.updateStatusBarItems(newActiveConnection);
    }

    public static updateStatusBarItems(activeConnection: IConnection) {
        if (Global.mysqlStatusBarItem) {
            Global.mysqlStatusBarItem.text = Global.getStatusBarItemText(activeConnection);
        } else {
            Global.mysqlStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            Global.mysqlStatusBarItem.text = Global.getStatusBarItemText(activeConnection);
            Global.mysqlStatusBarItem.show();
        }
    }

    public static tableFilter(tables: any[]) {
        if ( Global.keyword ) {
            return tables.filter((table1, table2) => {
                return table1.TABLE_NAME.indexOf( Global.keyword ) !== -1;
            });
        } else {
            return tables;
        }
    }

    private static _activeConnection: IConnection;
    private static mysqlStatusBarItem: vscode.StatusBarItem;

    private static getStatusBarItemText(activeConnection: IConnection): string {
        return `$(server) ${activeConnection.host}` + (activeConnection.database ? ` $(database) ${activeConnection.database}` : "");
    }
}

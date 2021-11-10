package com.paper.maplestory2codex.Entity;

import com.alibaba.fastjson.JSON;

public class AjaxResult {
    private long count;
    // result data body
    private Object body;

    public AjaxResult(long count, Object resultBody) {
        this.count = count;
        this.body = resultBody;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public Object getBody() {
        return body;
    }

    public void setBody(Object body) {
        this.body = body;
    }

    @Override
    public String toString() {
        return JSON.toJSONString(this);
    }
}

package com.paper.maplestory2codex.Entity;

public class Item {
    private long Id;
    private String Name, Type, Feature, Locale, Icon, Slot;

    public Item() {
    }

    public Item(long id, String name, String type, String feature, String locale, String icon, String slot) {
        Id = id;
        Name = name;
        Type = type;
        Feature = feature;
        Locale = locale;
        Icon = icon;
        Slot = slot;
    }

    public long getId() {
        return Id;
    }

    public void setId(long id) {
        Id = id;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getFeature() {
        return Feature;
    }

    public void setFeature(String feature) {
        Feature = feature;
    }

    public String getLocale() {
        return Locale;
    }

    public void setLocale(String locale) {
        Locale = locale;
    }

    public String getIcon() {
        return Icon;
    }

    public void setIcon(String icon) {
        Icon = icon;
    }

    public String getSlot() {
        return Slot;
    }

    public void setSlot(String slot) {
        Slot = slot;
    }
}

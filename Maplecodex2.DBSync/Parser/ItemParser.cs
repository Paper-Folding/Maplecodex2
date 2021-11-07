﻿using Maplecodex2.Data.Helpers;
using Maplecodex2.Data.Models;
using Maplecodex2.DBSync;
using Serilog;
using System.Xml;

namespace Maplecodex2.Data.Parser
{
    public static class ItemParser
    {
        /// <summary>
        /// Parse Items using itemname.xml and adding additional data from Xml/items/*.*
        /// </summary>
        /// <returns>List of Item.</returns>
        public static Dictionary<int, Item> Parse()
        {
            Dictionary<int, Item> itemList = new();
            XmlDocument itemname = FileHelper.ReadDataFromXml(Paths.XML_ITEM);
            XmlNodeList? itemNodes = itemname.SelectNodes("ms2/key");
            
            ConsoleUtility.TotalProgressCount = itemNodes.Count;
            ConsoleUtility.ProgressCount = 1;

            foreach (XmlNode? node in itemNodes)
            {
                ConsoleUtility.ClassName = $"Itemname.xml";
                ConsoleUtility.ProgressCount++;
                ConsoleUtility.WriteProgressBar();

                // Set Item values
                Item item = new();

                // From itemname
                item.Id = int.Parse(node.Attributes["id"] != null ? node.Attributes["id"].Value : "0");
                item.Type = node.Attributes["class"] != null ? node.Attributes["class"].Value : "";
                item.Name = node.Attributes["name"] != null ? node.Attributes["name"].Value : "";
                item.Feature = node.Attributes["feature"] != null ? node.Attributes["feature"].Value : "";
                item.Locale = node.Attributes["locale"] != null ? node.Attributes["locale"].Value : "";
                item.Icon = "icon0.png";
                item.Slot = "";

                itemList[item.Id] = item;
            }

            Log.Logger.Information($"{itemNodes.Count} Items successfully loaded!".Green());
            Log.Logger.Information($"Adding extra data to items...\n".Yellow());

            List<string> itemPreset = new();
            List<string> files = FileHelper.GetAllFilesFrom(Paths.XML_ROOT, "item");

            ConsoleUtility.TotalProgressCount = files.Count;
            ConsoleUtility.ProgressCount = 1;

            foreach (string file in files)
            {
                ConsoleUtility.ClassName = $"Items";
                ConsoleUtility.ProgressCount++;
                ConsoleUtility.WriteProgressBar();

                int id = int.Parse(Path.GetFileNameWithoutExtension(file));
                // Read and save the XML in document.
                XmlDocument? document = FileHelper.ReadDataFromXml(file);
                if (document == null) 
                {
                    continue; 
                }

                // Root node for start reading.
                XmlNode? property = document.SelectSingleNode("ms2/environment/property");
                XmlNode? slotNode = document.SelectSingleNode("ms2/environment/slots");
                if (property == null) 
                { 
                    continue; 
                }

                // Add aditional data to the item.
                string icon = "";
                if (property.Attributes["slotIcon"] != null)
                {
                    icon = property.Attributes["slotIcon"].Value != "icon0.png" ? property.Attributes["slotIcon"].Value : property.Attributes["slotIconCustom"].Value;
                    if (icon.StartsWith("./"))
                    {
                        icon = icon[2..];
                    }
                }

                string slot = slotNode.SelectSingleNode("slot").Attributes["name"].Value;

                string name = "";
                if (!itemList.ContainsKey(id))
                {
                    XmlNode? decal = slotNode.SelectSingleNode("slot/decal");
                    XmlNode? asset = slotNode.SelectSingleNode("slot/asset");
                    if (decal != null && decal.Attributes.Count > 0)
                    {
                        name = decal.Attributes["texture"].Value;
                    }
                    if (asset != null)
                    {
                        name = asset.Attributes["name"].Value;
                    }

                    slot = slotNode.SelectSingleNode("slot").Attributes["name"].Value;
                    Item item = new (id, "", name, "", "", icon, slot);
                    itemList.Add(id, item);

                    continue;
                }

                itemList[id].Icon = icon;
                itemList[id].Slot = slot;
            }

            return itemList;
        }
    }
}
